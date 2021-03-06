require('dotenv-safe').config({silent: true})
if (!process.env.TRAVIS) {
  console.log('Starting postinstall.js') //eslint-disable-line
  const co = require('co')
  const setupDatabase = require('./db/setupDatabase.js').bind(this)
  const rconnectionparams = { host: 'localhost', port: 28015 }
  this.rdbname = 'iocupid'
  this.utable = 'users'
  co(setupDatabase(rconnectionparams))
  .then(rconn => {
    rconn.close({noreplyWait: false})
  })
} else {
  console.log('Skipping postinstall because TRAVIS=true') //eslint-disable-line
}
