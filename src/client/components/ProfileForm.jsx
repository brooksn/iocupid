import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import Name from './Name.jsx'
import Email from './Email.jsx'
import SkillsInput from './SkillsInput.jsx'

export default class ProfileForm extends Component {
  render() {
    return (
      <Form horizontal>
        <Name />
        <Email />
        <SkillsInput />
      </Form>
    )
  }
}
