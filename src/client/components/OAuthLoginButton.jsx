import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import Spinner from 'react-spinkit'
import queryString from 'query-string'
import nonce from '../../nonce.js'
import { oneLineTrim } from 'common-tags'
import finishOauth from '../actions/finishOauth.js'
import { has } from 'lodash'
import { setJWTBase64 } from '../actions/ActionCreators.js'
import AppDispatcher from '../dispatcher/AppDispatcher.js'
import JWTPayload from '../react-prop-types/JWTPayload.js'

export default class OAuthLoginButton extends Component {
  constructor(props) {
    super(props)
    this.service = props.serviceName.toLowerCase()
    const state = {}
    state.authorized = has(this.props, 'jwtPayload.services.' + this.service)
    const urlQuery = queryString.parse(location.search)
    if (urlQuery.code && urlQuery.state
      && urlQuery.service.toLowerCase() === this.service) {
      state.oauthCallbackCode = urlQuery.code
      state.oauthCallbackState = urlQuery.state
      state.oauthCallbackService = urlQuery.service
      state.oauthCallback = true
    }
    if (urlQuery.spin) state.oauthCallback = 'spin'
    this.state = state
  }
  render() {
    const state = nonce(6)
    switch (this.state.oauthCallback) {
      case 'spin':
        var buttonLabel = 'Authorizing ' + this.props.serviceName
        break;
      case 'fail':
        buttonLabel = this.props.serviceName + ' authorization failed'
        break;
      default:
        buttonLabel = 'Sign in with ' + this.props.serviceName
    }
    const authUrl = oneLineTrim`
      ${this.props.oauthAuthUrl}
      ?client_id=${this.props.oauthClientId}
      &scope=${this.props.oauthScope}
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
        href={this.state.oauthCallback === 'spin' ? null : authUrl}>
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
      finishOauth(this.state.oauthCallbackCode, this.state.oauthCallbackState, this.service)
      .then(this.iocupidTokenCallback.bind(this))
      .catch(this.setState({oauthCallback: 'fail'}))
    }
  }
  componentWillReceiveProps(nextProps) {
    this.service = nextProps.serviceName.toLowerCase()
    const authorized = has(nextProps, 'jwtPayload.services.' + this.service)
    this.setState({authorized})
  }
  iocupidTokenCallback(token) {
    this.setState({oauthCallbackCode: null, oauthCallbackState: null})
    AppDispatcher.dispatch(setJWTBase64(token))
  }
}

OAuthLoginButton.propTypes = {
  styles: React.PropTypes.object,
  oauthAuthUrl: React.PropTypes.string.isRequired,
  oauthClientId: React.PropTypes.string.isRequired,
  serviceName: React.PropTypes.string.isRequired,
  oauthScope: React.PropTypes.string,
  jwtPayload: JWTPayload.allowNull
}

OAuthLoginButton.defaultProps = {
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
