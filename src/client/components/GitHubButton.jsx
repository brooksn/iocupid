import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import Spinner from 'react-spinkit'
import queryString from 'query-string'
import nonce from '../../nonce.js'
import { oneLineTrim } from 'common-tags'
import finishGitHubAuth from '../actions/finishGitHubAuth.js'
import { has } from 'lodash'
import { setJWTBase64 } from '../actions/ActionCreators.js'
import AppDispatcher from '../dispatcher/AppDispatcher.js'
import JWTPayload from '../react-prop-types/JWTPayload.js'
const ghclientid = process.env.GITHUB_CLIENT_ID

export default class GitHubLoginButton extends Component {
  constructor(props) {
    super(props)
    const state = {}
    state.authorized = has(this.props, 'jwtPayload.services.github')
    const urlQuery = queryString.parse(location.search)
    if (urlQuery.code && urlQuery.state) {
      state.oauthCallbackCode = urlQuery.code
      state.oauthCallbackState = urlQuery.state
      state.oauthCallback = true
    }
    if (urlQuery.spin) state.oauthCallback = 'spin'
    this.state = state
  }
  render() {
    const state = nonce(6)
    switch (this.state.oauthCallback) {
      case 'spin':
        var buttonLabel = 'Authorizing GitHub'
        break;
      case 'fail':
        buttonLabel = 'GitHub authorization failed'
        break;
      default:
        buttonLabel = 'Sign in with GitHub'
    }
    const githubAuthUrl = oneLineTrim`
      https://github.com/login/oauth/authorize
      ?client_id=${ghclientid}
      &scope=${['user:email'].join(' ')}
      &state=${state}`
    let spinner = null
    if (this.state.oauthCallback === 'spin') {
      spinner = ( // eslint-disable-line no-extra-parens
        <Spinner
          style={this.props.styles.spinner} 
          spinnerName="cube-grid" 
          noFadeIn 
        />
      )
    }
    const authButton = ( //eslint-disable-line no-extra-parens
      <Button bsSize="small"
        href={this.state.oauthCallback === 'spin' ? null : githubAuthUrl}>
        <span style={this.props.styles.buttonText}>
          {buttonLabel}
        </span>
        {spinner}
      </Button>
    )
    return authButton
  }
  componentWillMount() {
    if (this.state.oauthCallbackCode && this.state.oauthCallbackState) {
      finishGitHubAuth(this.state.oauthCallbackCode, this.state.oauthCallbackState)
      .then(this.iocupidTokenCallback.bind(this))
      .catch(this.setState({oauthCallback: 'fail'}))
    }
  }
  componentWillReceiveProps(nextProps) {
    const authorized = has(nextProps, 'jwtPayload.services.github')
    this.setState({authorized})
  }
  iocupidTokenCallback(token) {
    this.setState({oauthCallbackCode: null, oauthCallbackState: null})
    AppDispatcher.dispatch(setJWTBase64(token))
  }
}

GitHubLoginButton.propTypes = {
  styles: React.PropTypes.object,
  jwtPayload: JWTPayload.allowNull
}

GitHubLoginButton.defaultProps = {
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
