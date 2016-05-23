import React, { Component } from 'react'
import { Link } from 'react-router'
import { Button, Navbar } from 'react-bootstrap'
import Spinner from 'react-spinkit'
import queryString from 'query-string'
import nonce from '../../nonce.js'
import finishGitHubAuth from '../actions/finishGitHubAuth.js'
//import * as jwtStore from '../stores/formInputStore.js'
const ghclientid = process.env.GITHUB_CLIENT_ID
const ghscopes = ['user:email']
const ghauthbase = 'https://github.com/login/oauth/authorize'

export default class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    const urlQuery = queryString.parse(location.search)
    if (urlQuery.code && urlQuery.state) {
      this.setState({
        oauthCallbackCode: urlQuery.code, 
        oauthCallbackState: urlQuery.state, 
        oauthCallback: true
      })
    }
    if (urlQuery.spin) this.setState({oauthCallback: true})
  }
  render() {
    const oauthCallback = this.state.oauthCallback ? true : false
    let scopes = ghscopes.join(' ')
    let state = nonce(6)
    let githubAuthUrl = `${ghauthbase}?client_id=${ghclientid}&scope=${scopes}&state=${state}`
    let spinner = null
    if (oauthCallback === true) {
      spinner = ( // eslint-disable-line no-extra-parens
        <Spinner
          style={this.props.styles.spinner} 
          spinnerName="cube-grid" 
          noFadeIn 
        />
      )
    }
    return (
    <Navbar>
      <Navbar.Header>
        <Link to="/">
          <Navbar.Brand>
            ioCupid
          </Navbar.Brand>
        </Link>
      </Navbar.Header>
      <Navbar.Form pullRight>
        <Button bsSize="small"
          href={oauthCallback === true ? null : githubAuthUrl}>
          <span style={this.props.styles.buttonText}>
            {oauthCallback === true ? 'Authorizing Github' : 'Sign in with GitHub'}
          </span>
          {spinner}
        </Button>
      </Navbar.Form>
    </Navbar>
    )
  }
  componentWillMount() {
    if (this.state.oauthCallbackCode && this.state.oauthCallbackState) {
      finishGitHubAuth(this.state.oauthCallbackCode, this.state.oauthCallbackState)
      .then(jwt => {
        // Dispatch an action with the jwt. It's base64 encoded at this step.
        // eslint-disable-next-line no-console
        console.log(jwt)
        this.setState({oauthCallbackCode: null, oauthCallbackState: null})
      })
    }
  }
}

Header.propTypes = {
  styles: React.PropTypes.object
}

Header.defaultProps = {
  styles: {
    spinner: {
      float: 'right',
      marginLeft: '0.8em'
    },
    buttonText: {
      float: 'left',
      marginTop: '0.35em'
    }
  }
}
