import React, { Component, Children, createContext, cloneElement } from 'react'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

import merge from 'deepmerge'

function toObject(path, value) {
  const [ head, ...tail ] = path.split('/')

  return head === path?
    {[head]: value}
    : {[head]: toObject(tail.join('/'), value)}
}

function toValue(path, object) {
  const [ head, ...tail ] = path.split('/')

  return head === path?
    object[head]
    : toValue(tail.join('/'), object[head])
}

export const signInDatabase = path => class Db extends Component {

  static contextType = createContext()
  static mounted = false

  state = {}
  
  constructor() {
    super()

    if (!Db.mounted) {
      const config = {
        apiKey            : 'AIzaSyCKE8XTWiaGoLE876gg_fTMMj0yDLV7L2Q',
        authDomain        : 'test-3bb26.firebaseapp.com',
        databaseURL       : 'https://test-3bb26.firebaseio.com',
        projectId         : 'test-3bb26',
        storageBucket     : 'test-3bb26.appspot.com',
        messagingSenderId : '198127730795'
      }
      firebase.initializeApp(config)
    }

    this.mounted = Db.mounted
    Db.mounted = true
  }

  componentDidMount() {
    if (this.mounted) return

    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(this.onAuthStateChanged)
    firebase.auth().signInAnonymously()
  }

  componentWillUnmount() {
    if (this.mounted) return

    this.unregisterAuthObserver()
    if (this.ref) this.ref.off('value', this.onValueChange)
  }

  onAuthStateChanged = user => {
    const uid = (user||{}).uid
    if (!uid) return

    console.warn(`uid ${uid}`)
    this.setState({ uid })
    
    this.ref = firebase.database().ref(path)
    this.ref.on('value', this.onValueChange)
    
    const ref = firebase.database().ref(`${path}/${uid}`)
    ref.set(true)
    ref.onDisconnect().remove()
  }

  onValueChange = snap => {
    this.setState(toObject(path, snap.val()))
  }
  
  render() {
    const { children } = this.props

    const consumer = (
      <Db.contextType.Consumer>
        {value => Children.map(children, child => cloneElement(child, value))}
      </Db.contextType.Consumer>
    )

    return this.mounted? consumer : Object.keys(this.state).length? (
      <Db.contextType.Provider value={this.state}>
        {consumer}
      </Db.contextType.Provider>
    ) : null
  }
}

export const connectDatabase = path => class Db extends Component {

  static contextType = createContext()
  static mounted = false

  state = {}
  
  constructor(props) {
    super(props)

    this.mounted = Db.mounted
    Db.mounted = true
  }

  componentDidMount() {
    console.log(`componentDidMount ${path}`)
    if (this.mounted) return

    this.ref = firebase.database().ref(path)
    this.setState(toObject(path, [null, this.setDatabase]))

    this.ref.on('value', this.onValueChange)
  }

  componentWillUnmount() {
    console.log(`componentDidMount ${path}`)
    if (this.mounted) return

    this.ref.off('value', this.onValueChange)
  }

  setDatabase = value => {
    const [ database ] = toValue(path, this.state)

    this.ref.set(
      typeof value === 'object'
          && value !== null?
        {...database, ...value}
        : value
    )
  }
  
  onValueChange = snap => {
    this.setState(toObject(path, [snap.val(), this.setDatabase]))
  }

  render() {
    const { children } = this.props
    const props = {...this.props}
    delete props.children

    const consumer = (
      <Db.contextType.Consumer>
        {value => Children.map(children, child => cloneElement(child, merge(props, value)))}
      </Db.contextType.Consumer>
    )

    return this.mounted? consumer : (
      <Db.contextType.Provider value={this.state}>
        {consumer}
      </Db.contextType.Provider>
    )
  }
}
