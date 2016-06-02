import React, { Component } from 'react'
import { Col, ControlLabel, FormControl, FormGroup} from 'react-bootstrap'
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
      <FormGroup>
        <Col componentClass={ControlLabel} sm={2}>
          Email
        </Col>
        <Col sm={10}>
          <FormControl type="email"
            placeholder="example@gmail.com"
            onChange={this.handleEmailInputChange.bind(this)} 
          />
        </Col>
      </FormGroup>
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
