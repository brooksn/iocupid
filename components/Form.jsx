import React, { Component } from 'react'
import TagsField from './TagsField.jsx'
import keywords from '../mergedKeywords.json'

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    return (
    <div className="row">
      <div className="col-lg-6">
        <div className="well bs-component">
          <form className="form-horizontal">
            <fieldset>
              <div className="form-group">
                <label for="inputEmail" className="col-lg-2 control-label">Email</label>
                <div className="col-lg-10">
                  <input type="email" className="form-control" id="inputEmail" placeholder="Email" />
                </div>
                <TagsField />
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
    )
  }
  handleSubmit () {
    
  }
}
