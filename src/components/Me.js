import React, { Component } from 'react'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

import generateStore from './Store'

class Me extends Component {

  static contextType = generateStore()

  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(this.onAuthStateChanged)
    firebase.auth().signInAnonymously()
  }

  componentWillUnmount() {
    this.unregisterAuthObserver()
    this.meRef.off('value', this.onValueChange)
  }

  onAuthStateChanged = user => {
    this.uid = (user||{}).uid
    
    this.meRef = firebase.database().ref(`players/${this.uid}`)
    this.meRef.on('value', this.onValueChange)

    const statusRef = firebase.database().ref(`online/${this.uid}`)
    statusRef.set(true)
    statusRef.onDisconnect().remove()
  }

  onValueChange = data => {
    const [, setMe ] = this.context
    setMe(data.val())
  }
  
  render() {
    return (
      <Me.contextType>
        {this.props.children}
      </Me.contextType>
    )
  }
}

export default Me
