import React, { Component } from 'react'
import * as store from '../stores/formInputStore.js'

export default class Name extends Component {
  constructor(props) {
    super(props)
    const name = store.getName()
    this.state = {
      name: name
    }
  }
  render() {
    return (
    <div className="input-section">
      <div className="input-container">
        <input type="text" 
          placeholder="Jane Doe" 
          onChange={this.handleNameInputChange.bind(this)} 
        />
      </div>
    </div>
    )
  }
  storeChange(change) {
    if (change === 'CHANGE_NAME') {
      const name = store.getName()
      this.setState({name: name})
    }
  }
  componentDidMount() {
    store.observeChanges(this.storeChange.bind(this))
  }
  componentWillUnmount() {
    store.unobserveChanges(this.storeChange.bind(this))
  }
  handleNameInputChange(event) {
    const name = event.target.value
    store.changeName(name)
  }
}
