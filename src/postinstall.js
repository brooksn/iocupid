require('dotenv-safe').config({silent: true})
console.log('Starting postinstall.js') //eslint-disable-line
const co = require('co')
const setupDatabase = require('./setupDatabase.js').bind(this)
const rconnectionparams = { host: 'localhost', port: 28015 }
this.rdbname = 'iocupid'
this.utable = 'users'
co(setupDatabase(rconnectionparams))
.then(rconn => {
  rconn.close({noreplyWait: false})
})
