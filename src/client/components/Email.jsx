import React, { Component } from 'react'
import * as store from '../stores/formInputStore.js'

export default class Email extends Component {
  constructor (props) {
    super(props)
    let email = store.getEmail()
    this.state = {
      email: email
    }
  }
  render () {
    return (
    <div className="input-section">
      <div className="input-container">
        <input type="email" placeholder="example@gmail.com" onChange={this.handleEmailInputChange.bind(this)} />
      </div>
    </div>
    )
  }
  storeChange (change) {
    if (change === 'CHANGE_EMAIL') {
      let email = store.getEmail()
      this.setState({email: email})
    }
  }
  componentDidMount () {
    store.observeChanges(this.storeChange.bind(this))
  }
  componentWillUnmount () {
    store.unobserveChanges(this.storeChange.bind(this))
  }
  handleEmailInputChange (event) {
    let email = event.target.value
    store.changeEmail(email)
  }
}
