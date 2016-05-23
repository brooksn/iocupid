import React, { Component } from 'react'
import GitHubForkRibbon from 'react-github-fork-ribbon'
import Header from './Header.jsx'

export class App extends Component {
  render() {
    return (
    <div className="app" thingy={true}>
      <GitHubForkRibbon
        href="//github.com/brooksn/iocupid" 
        position="right" 
        color="black">
        Fork me on GitHub
      </GitHubForkRibbon>
      <div style={{marginLeft:'0.4em', marginRight:'0.4em'}}>
        <Header />
        <div className="container">
          {this.props.children}
        </div>
      </div>
    </div>
    )
  }
}

App.propTypes = {
  children: React.PropTypes.element.isRequired
}
