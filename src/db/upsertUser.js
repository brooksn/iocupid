/* eslint-disable max-nested-callbacks */
const r = require('rethinkdb')
module.exports = function upsertUser(id, user, serviceName) {
  const publicServiceAddresses = user.emails
    .filter(e => e.public === true)
    .map(e => e.address)
  
  return r.db(this.rdbname).table(this.utable).get(id).replace(doc => {
    return r.branch(
        doc.eq(null),
        r.expr(user)
          .merge({emails: user.emails.map(email => {
            return r.expr(email).merge({public:
              r.branch(
                r.expr(email)('public').eq(true),
                [serviceName],
                []
              )
            })
          })})
          .merge({id: id, created_at: r.now()}),
        doc.merge(user).merge({emails: doc('emails').map(email => {
          return email.merge({public: email('public')
            .append(
              r.branch(
                r.expr(publicServiceAddresses).contains(email('address')),
                serviceName,
                null
              )
            )
            .filter(truthy => truthy)
            .distinct()
          })
        }), updated_at: r.now()})
    )
  }).run(this.rconn)
}
