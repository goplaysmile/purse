import React, { Component, createContext } from 'react'

class Store extends Component {
  state = {
    hook: [
      {},
      // TODO: add callback version of parameter
      items => {
        this.setState(({ hook: [store, setStore] }) => {

          if (typeof items !== 'object' || items === null) return

          Object.keys(items)
            .filter(item => items[item] === null)
            .forEach(item => {
              delete items[item]
              delete store[item]
            })

          return {hook: [{...store, ...items}, setStore]}
        })
      }
    ]
  }
}

export const generateStore = init => class Temp extends Store {

  static contextType = createContext()

  componentDidMount() {
    if (!init) return
    const [, setStore ] = this.state.hook
    setStore(init)
  }

  render() {
    return (
      <Temp.contextType.Provider value={this.state.hook}>
        {this.props.children}
      </Temp.contextType.Provider>
    )
  }
}
