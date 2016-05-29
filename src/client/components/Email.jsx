import React, { Component } from 'react'
import store, { changeEmail, getEmail, CHANGE_EVENT } from '../stores/formInputStore.js'

export default class Email extends Component {
  constructor(props) {
    super(props)
    const email = getEmail()
    this.state = {
      email: email
    }
  }
  render() {
    return (
    <div className="input-section">
      <div className="input-container">
        <input 
          type="email" 
          placeholder="example@gmail.com" 
          onChange={this.handleEmailInputChange.bind(this)} 
        />
      </div>
    </div>
    )
  }
  storeChange() {
    const email = getEmail()
    if (email !== this.state.email) this.setState({email})
  }
  componentDidMount() {
    store.on(CHANGE_EVENT, this.storeChange.bind(this))
  }
  componentWillUnmount() {
    store.removeListener(CHANGE_EVENT, this.storeChange.bind(this))
  }
  handleEmailInputChange(event) {
    const email = event.target.value
    changeEmail(email)
  }
}
