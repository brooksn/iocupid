const r = require('rethinkdb')
const errorIgnoreCase = 'already exists'

module.exports = function* setupDatabase(rconnectionparams) {
  this.rconn = yield r.connect(rconnectionparams)
  try {
    yield r.dbCreate(this.rdbname).run(this.rconn)
  } catch (err) {
    if (err.msg.indexOf(errorIgnoreCase) < 0) throw err
  }
  try {
    yield r.db(this.rdbname).tableCreate(this.utable).run(this.rconn)
  } catch (err) {
    if (err.msg.indexOf(errorIgnoreCase) < 0) throw err
  }
  try {
    yield r.db(this.rdbname).table(this.utable).indexCreate('skills', {multi: true}).run(this.rconn)
  } catch (err) {
    if (err.msg.indexOf(errorIgnoreCase) < 0) throw err
  }
  try {
    yield r.db(this.rdbname).table(this.utable).indexCreate('groups', {multi: true}).run(this.rconn)
  } catch (err) {
    if (err.msg.indexOf(errorIgnoreCase) < 0) throw err
  }
  yield r.db(this.rdbname).table(this.utable).indexWait().run(this.rconn)
  return this.rconn
}
