import React from 'react'
import ReactDOM from 'react-dom'
import { Route, Router, IndexRoute, browserHistory } from 'react-router'
import { App } from './components/App.jsx'
import Home from './components/Home.jsx'
import Form from './components/Form.jsx'
import Search from './components/Search.jsx'

const router = ( // eslint-disable-line no-extra-parens
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="/form" component={Form} />
      <Route path="/search" component={Search} />
    </Route>
  </Router>
)

ReactDOM.render(router, document.getElementById('app'))
