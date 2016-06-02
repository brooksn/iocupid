import React, { Component } from 'react'
import { Col, ControlLabel, FormControl, FormGroup} from 'react-bootstrap'
import store, { changeName, getName, CHANGE_EVENT } from '../stores/formInputStore.js'


export default class Name extends Component {
  constructor(props) {
    super(props)
    const name = getName()
    this.state = {
      name: name
    }
  }
  render() {
    return (
      <FormGroup>
        <Col componentClass={ControlLabel} sm={2}>
          Name
        </Col>
        <Col sm={10}>
          <FormControl type="text"
            placeholder="Jane Doe"
            onChange={this.handleNameInputChange.bind(this)} 
          />
        </Col>
      </FormGroup>
    )
  }
  storeChange() {
    const name = getName()
    if (name !== this.state.name) this.setState({name})
  }
  componentDidMount() {
    store.on(CHANGE_EVENT, this.storeChange.bind(this))
  }
  componentWillUnmount() {
    store.removeListener(CHANGE_EVENT, this.storeChange.bind(this))
  }
  handleNameInputChange(event) {
    const name = event.target.value
    changeName(name)
  }
}
