require('dotenv-safe').config({silent: true})
const PORT = process.env.PORT || 8080
const EventEmitter = require('events');
const server = new EventEmitter();
const enableDestroy = require('server-destroy')
const co = require('co')
const r = require('rethinkdb')
const path = require('path')
const emoji = require('node-emoji')
const webpack = require('webpack')
const webpackConfig = require('../webpack.config.js')
const webpacker = webpack(webpackConfig)
const oauthAuth = require('./express_routes/oauth_auth.js').bind(this)
const express = require('express')
const app = express()
const rconnectionparams = { host: 'localhost', port: 28015 }
this.ghsecret = process.env.GITHUB_CLIENT_SECRET
this.ghid = process.env.GITHUB_CLIENT_ID
this.ghtokenurl = 'https://github.com/login/oauth/access_token'
this.rdbname = 'iocupid'
this.utable = 'users'

if (process.env.NODE_ENV === 'development') {
  app.use(require('webpack-dev-middleware')(webpacker, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }))
  app.use(require('webpack-hot-middleware')(webpacker))
}

app.use('/static', express.static(path.join(__dirname, '../', 'dist')))
app.use('/css', express.static(path.join(__dirname, 'client/css')))
app.use('/bootswatch', express.static(
  path.join(__dirname, 'client/bootswatch')
))
app.use('/bootswatch-3.3.6-dist', express.static(
  path.join(__dirname, 'client/bootswatch-3.3.6-dist')
))

app.get('/api/test', (req, res) => res.send(emoji.emojify('Just a test :heart:')))

app.get('/api/oauth_auth', (req, res) => {
  co(oauthAuth(req.query.code))
  .then(jwt => res.send(jwt))
  .catch(err => {
    res.status(500).send(err)
  })
})

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'client/index.html')))

r.connect(rconnectionparams)
.then(rconn => {
  this.rconn = rconn
  module.exports.rconn = this.rconn
  module.exports.http = app.listen(PORT, () => {
    enableDestroy(module.exports.http);
    module.exports.emit('server started', PORT)
    module.exports.stop = () => {
      server.http.destroy()
      return server.rconn.close({noreplyWait: false})
    }
  })
}).catch(err => console.error(err)) //eslint-disable-line

module.exports = server
