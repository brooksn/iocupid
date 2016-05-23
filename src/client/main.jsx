import React from 'react'
import ReactDOM from 'react-dom'
import { Route, Router, IndexRoute, browserHistory } from 'react-router'
import { App } from './components/App.jsx'
import Home from './components/Home.jsx'
import Form from './components/Form.jsx'

const router = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="/form" component={Form} />
    </Route>
  </Router>
)

ReactDOM.render(router, document.getElementById('app'))
