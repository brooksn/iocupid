import React, { Component } from 'react'
import { PageHeader, Row } from 'react-bootstrap'

export default class Home extends Component {

  render () {
    return (
      <Row>
        <PageHeader>Form a great team.</PageHeader>
        <p>Welcome! Sign in with GitHub to get started. More integrations are coming soon.</p>
      </Row>
    )
  }
}
