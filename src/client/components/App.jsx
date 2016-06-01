import React, { Component } from 'react'
import GitHubForkRibbon from 'react-github-fork-ribbon'
import store, { getJWTPayload, CHANGE_EVENT } from '../stores/authStore.js'
import Header from './Header.jsx'

export class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      jwtPayload: getJWTPayload()
    }
  }
  render() {
    const childrenWithProps = React.Children.map(this.props.children,
      child => React.cloneElement(child, {
          jwtPayload: this.state.jwtPayload || null
        })
      )
    return (
    <div className="app" thingy={true}>
      <GitHubForkRibbon
        href="//github.com/brooksn/iocupid" 
        position="right" 
        color="black">
        Fork me on GitHub
      </GitHubForkRibbon>
      <div style={{marginLeft:'0.4em', marginRight:'0.4em'}}>
        <Header jwtPayload={this.state.jwtPayload} />
        <div className="container">
          {childrenWithProps}
        </div>
      </div>
    </div>
    )
  }
  authStoreChange() {
    this.setState({jwtPayload: getJWTPayload()})
  }
  componentDidMount() {
    store.on(CHANGE_EVENT, this.authStoreChange.bind(this))
  }
  componentWillUnmount() {
    store.removeListener(CHANGE_EVENT, this.authStoreChange.bind(this))
  }
}

App.propTypes = {
  children: React.PropTypes.element.isRequired
}
