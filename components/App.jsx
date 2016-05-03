import React, { Component } from 'react'
import Name from './Name.jsx'
import Email from './Email.jsx'
import SkillTags from './SkillTags.jsx'
import * as store from '../stores/formInputStore.js'

export class App extends Component {
  render () {
    return (
    <div className="app">
      <hr />
      <Name />
      <Email />
      <SkillTags />
      <hr />
    </div>
    )
  }
  printStore () {
    return store
  }
}
