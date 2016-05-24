const r = require('rethinkdb')

module.exports = function* setupDatabase(rconnectionparams) {
  this.rconn = yield r.connect(rconnectionparams)
  try {
    yield r.dbCreate(this.rdbname).run(this.rconn)
  } catch (err) {
    if (err.msg !== 'Database `' + this.rdbname + '` already exists.') throw err
  }
  try {
    yield r.db(this.rdbname).tableCreate(this.utable).run(this.rconn)
  } catch (err) {
    if (err.msg !== 'Table `' + this.rdbname + '.' + this.utable + '` already exists.') throw err
  }
  yield r.db(this.rdbname).table(this.utable).indexCreate('skills', {multi: true}).run(this.rconn)
  yield r.db(this.rdbname).table(this.utable).indexCreate('groups', {multi: true}).run(this.rconn)
  return yield r.db(this.rdbname).table(this.utable).indexWait().run(this.rconn)
}
