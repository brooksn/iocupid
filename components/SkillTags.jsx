import React, { Component } from 'react'
import * as store from '../stores/formInputStore.js'
import keywords from '../mergedKeywords.json'
import Tags from 'react-tag-autocomplete'

export default class SkillTags extends Component {
  constructor (props) {
    super(props)
    let suggestions = keywords.map((val, ind) => {
      return {id: val, name: val}
    })
    this.state = {
      input: '',
      tags: [],
      suggestions: suggestions
    }
  }
  render () {
    const tags = this.state.tags
    let suggestions
    let input = this.state.input
    let filter = val => val.name != input
    if (typeof input === 'string' && input.length > 0) {
      suggestions = [{id: input, name: input}].concat(this.state.suggestions.filter(filter))
    } else {
      suggestions = this.state.suggestions
    }

    return (
      <Tags
        tags={tags}
        suggestions={suggestions}
        placeholder="add new skill"
        handleDelete={this.handleDelete.bind(this)}
        handleAddition={this.handleAddition.bind(this)}
        handleInputChange={this.handleInputChange.bind(this)} />
    )
  }
  storeChange (change) {
    if (change === 'CHANGE_SKILLS') {
      let skills = store.getSkills()
      let tags = skills.map((val, ind) => {
        return {id: val, name: val}
      })
      this.setState({tags: tags})
    }
  }
  componentDidMount () {
    store.observeChanges(this.storeChange.bind(this))
  }
  componentWillUnmount () {
    store.unobserveChanges(this.storeChange.bind(this))
  }
  handleDelete (i) {
    let tags = this.state.tags
    let tag = tags.splice(i, 1)
    store.removeSkill(tag.name)
  }
  handleAddition (tag) {
    let name = tag
    if (typeof tag !== 'string') name = tag.name

    store.addSkill(name)
  }
  handleInputChange (input) {
    this.setState({input: input})
  }
}
