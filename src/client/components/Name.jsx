import React, { Component } from 'react'
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
