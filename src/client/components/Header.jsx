import React, { Component } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Nav, Navbar, NavItem } from 'react-bootstrap'
import { has } from 'lodash'
import JWTPayload from '../react-prop-types/JWTPayload.js'
import GitHubButton from './GitHubButton.jsx'
import LazyImage from './LazyImage.jsx'

export default class Header extends Component {
  render() {
    const ghAuthorized = has(this.props, 'jwtPayload.services.github')
    if (has(this.props, 'jwtPayload.services.github.username')) {
     const jsonReducer = json => json.avatar_url
     const ghUsername = this.props.jwtPayload.services.github.username
     var avatar = ( // eslint-disable-line no-extra-parens
       <LazyImage url={`https://api.github.com/users/${ghUsername}`}
         jsonReducer={jsonReducer}
         placeholder="public/anonymous.png"
       />
      )
    } else {
      avatar = <img src="public/anonymous.png" />
    }
    return (
    <Navbar>
      <Navbar.Header>
        <LinkContainer to="/">
          <Navbar.Brand>
            ioCupid
          </Navbar.Brand>
        </LinkContainer>
      </Navbar.Header>
      <Nav bsStyle="pills">
        <LinkContainer to="/search">
          <NavItem>Search</NavItem>
        </LinkContainer>
        <LinkContainer to="/form">
          <NavItem href="/form">Form</NavItem>
        </LinkContainer>
      </Nav>
      <Navbar.Form pullRight>
        {ghAuthorized === true ? avatar : <GitHubButton jwtPayload={this.props.jwtPayload} />}
      </Navbar.Form>
    </Navbar>
    )
  }
}

Header.propTypes = {
  jwtPayload: JWTPayload.allowNull
}
