import React, { Component } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Nav, Navbar, NavItem } from 'react-bootstrap'
import { has } from 'lodash'
import JWTPayload from '../react-prop-types/JWTPayload.js'
import OAuthLoginButton from './OAuthLoginButton.jsx'
import LazyImage from './LazyImage.jsx'

export default class Header extends Component {
  render() {
    const ghAuthorized = has(this.props, 'jwtPayload.services.github')
    const slackAuthorized = has(this.props, 'jwtPayload.services.slack')
    let avatar
    if (has(this.props, 'jwtPayload.services.slack.avatar')) {
      avatar = <img src={this.props.jwtPayload.services.slack.avatar}
        style={this.props.styles.avatar.img} />
    } else if (has(this.props, 'jwtPayload.services.github.avatar')) {
      avatar = <img src={this.props.jwtPayload.services.github.avatar}
        style={this.props.styles.avatar.img} />
    } else if (has(this.props, 'jwtPayload.services.github.username')) {
       const jsonReducer = json => json.avatar_url
       const ghUsername = this.props.jwtPayload.services.github.username
       avatar = ( // eslint-disable-line no-extra-parens
         <LazyImage url={`https://api.github.com/users/${ghUsername}`}
           jsonReducer={jsonReducer}
           placeholder="public/anonymous.png"
           styles={this.props.styles.avatar}
         />)
    }
    const githubButton = ( // eslint-disable-line no-extra-parens
      <OAuthLoginButton
        jwtPayload={this.props.jwtPayload}
        serviceName="GitHub"
        oauthAuthUrl="https://github.com/login/oauth/authorize"
        oauthClientId={process.env.GITHUB_CLIENT_ID}
        oauthScope={['user:email'].join(' ')}
      />
    )
    const slackButton = ( // eslint-disable-line no-extra-parens
      <OAuthLoginButton
        jwtPayload={this.props.jwtPayload}
        serviceName="Slack"
        oauthAuthUrl="https://slack.com/oauth/authorize"
        oauthClientId={process.env.SLACK_CLIENT_ID}
        oauthScope={['identity.basic','identity.email','identity.team','identity.avatar'].join(',')}
      />
    )
    const authButtons = ( // eslint-disable-line no-extra-parens
      <div>
        {slackButton}
        {githubButton}
      </div>
    )

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
        {ghAuthorized === true || slackAuthorized === true ? avatar : authButtons}
      </Navbar.Form>
    </Navbar>
    )
  }
}

Header.propTypes = {
  jwtPayload: JWTPayload.allowNull,
  styles: React.PropTypes.object
}

Header.defaultProps = {
  styles: {
    avatar: {
      img: {
        width: '3.8em',
        borderRadius: '50%'
      }
    }
  }
}
