import React, { Component } from 'react'
import nonce from '../actions/nonce.js'
import queryString from 'query-string'
import finishGitHubAuth from '../actions/finishGitHubAuth.js'
import Name from './Name.jsx'
import Email from './Email.jsx'
import SkillTags from './SkillTags.jsx'
import * as store from '../stores/formInputStore.js'
const ghclientid = process.env.GITHUB_CLIENT_ID

export class App extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    const urlQuery = queryString.parse(location.search)
    if (urlQuery.code && urlQuery.state) {
      this.state.oauthCallbackCode = urlQuery.code
      this.state.oauthCallbackState = urlQuery.state
    }
  }
  render () {
    let githubAuthEnabled = this.state.oauthCallbackCode ? false : true
    let githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${ghclientid}&state=${nonce(6)}`
    return (
    <div className="app">
      <h1>ioCupid</h1>
      <a
        href={githubAuthEnabled ? githubAuthUrl : null}>
        {githubAuthEnabled ? 'Sign in with GitHub' : 'Authorizing GitHub...'}
      </a>
      <hr />
      <Name />
      <Email />
      <SkillTags />
      <hr />
    </div>
    )
  }
  printStore () {
    return store
  }
  componentDidMount () {
    if (this.state.oauthCallbackCode && this.state.oauthCallbackState) {
      finishGitHubAuth(this.state.oauthCallbackCode, this.state.oauthCallbackState)
      .then(got => console.log('got something back: ' + got))
    }
  }
}
