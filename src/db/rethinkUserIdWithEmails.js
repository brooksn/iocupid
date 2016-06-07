const r = require('rethinkdb')
module.exports = function userIdWithEmail(emailAddresses) {
  // returning a promise...
  return r.db(this.rdbname).table(this.utable)
    .filter(row => row('emails')
      .contains(email => r.expr(emailAddresses)
        .contains(email('address'))
      )
    )
    .getField('id').run(this.rconn)
}
