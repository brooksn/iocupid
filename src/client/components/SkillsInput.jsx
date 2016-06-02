import React, { Component } from 'react'
import { Col, ControlLabel, FormGroup} from 'react-bootstrap'
import Typeahead from 'react-bootstrap-typeahead'
import { isEqual } from 'lodash'
import skillsKeywords from '../mergedKeywords.js'
import styles from '../css/TypeaheadStyles.js'

export default class SkillsInput extends Component {
  constructor(props) {
    super(props)
    const suggestions = skillsKeywords.map((word, id) => {
      return {label: word, id}
    })
    this.state = {
      tags: [],
      suggestions
    }
  }
  handleChange(objects) {
    const words = objects.map(tag => tag.label)
    const tags = this.state.tags
    if (!isEqual(words, tags)) this.setState({tags: words})
  }
  shouldComponentUpdate(nextProps) {
    if (!isEqual(this.props, nextProps)) return true
    else return false
  }
  render() {
    return (
      <FormGroup>
        <style type="text/css">{styles}</style>
        <Col componentClass={ControlLabel} sm={2}>
          Skills
        </Col>
        <Col bsStyle sm={10}>
          <Typeahead multiple
            placeholder="skill"
            emptyLabel="no tags found"
            allowNew={this.props.allowCustomTags}
            onChange={this.handleChange.bind(this)}
            options={this.state.suggestions}
          />
        </Col>
      </FormGroup>
    )
  }
}

SkillsInput.propTypes = {
  allowCustomTags: React.PropTypes.bool
}

SkillsInput.defaultProps = {
  allowCustomTags: false
}
