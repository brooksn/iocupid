import React, { Component } from 'react'
import store, { addSkill, removeSkill, getSkills, CHANGE_EVENT } from '../stores/formInputStore.js'
import keywords from '../mergedKeywords.js'
import Tags from 'react-tag-autocomplete'
const allowCustomTags = false

export default class SkillTags extends Component {
  constructor(props) {
    super(props)
    const suggestions = keywords.map(keyword => {
      return {id: keyword, name: keyword}
    })
    this.state = {
      input: '',
      tags: [],
      suggestions: suggestions
    }
  }
  render() {
    const tags = this.state.tags
    let suggestions
    const input = this.state.input
    const filter = val => val.name != input
    if (allowCustomTags === true && typeof input === 'string' && input.length > 0) {
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
  storeChange() {
    const skills = getSkills()
    const l = skills.length
    const tags = this.state.tags.map(tag => tag.name)
    const skillTags = skills.map(skill => {return {id:skill, name:skill}})
    const t = tags.length
    if (l !== t) return this.setState({tags: skillTags})
    for (let i=0; i < l; i++) {
      if (skills[i] !== this.state.tags[i]) {
        this.setState({tags: skillTags})
        break;
      }
    }
  }
  componentDidMount() {
    store.on(CHANGE_EVENT, this.storeChange.bind(this))
  }
  componentWillUnmount() {
    store.removeListener(CHANGE_EVENT, this.storeChange.bind(this))
  }
  handleDelete(i) {
    const tags = this.state.tags
    const tag = tags.splice(i, 1)
    removeSkill(tag.name)
  }
  handleAddition(tag) {
    let name = tag
    if (typeof tag !== 'string') name = tag.name
    addSkill(name)
  }
  handleInputChange(input) {
    this.setState({input})
  }
}
