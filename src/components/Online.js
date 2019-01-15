import React, { Component } from 'react'

import firebase from 'firebase/app'
import 'firebase/database'

import generateStore from './Store'

class Online extends Component {

  static contextType = generateStore()
  
  componentDidMount() {
    this.onlineRef = firebase.database().ref(`online`)
    this.onlineRef.on('value', this.onValueChange)
  }

  componentWillUnmount() {
    this.onlineRef.off('value', this.onValueChange)
  }

  onValueChange = data => {
    const [, setOnline ] = this.context
    setOnline(data.val())
  }
  
  render() {
    return (
      <Online.contextType>
        {this.props.children}
      </Online.contextType>
    )
  }
}

export default Online
