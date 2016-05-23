const nonce = require('../nonce.js')
const userIdWithEmail = require('../rethinkUserIdWithEmail.js')
const fetch = require('node-fetch')
const r = require('rethinkdb')
const jsonwebtoken = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
// const wait = require('wait-promise')

module.exports = function* oauth_auth(code) {
  if (!this.rconn || !this.rdbname || !this.utable) {
    throw Error('this.rconn, this.dbname, and this.utable are required.')
  }
  const u = `${this.ghtokenurl}?client_id=${this.ghid}&client_secret=${this.ghsecret}&code=${code}`
  const tokenRes = yield fetch(u, {
    method: 'POST', 
    headers: {Accept: 'application/json'}
  })
  const tokenJson = yield tokenRes.json()
  const token = tokenJson.access_token
  const ghEmailsUrl = `https://api.github.com/user/emails?access_token=${token}`
  const ghEmails = yield fetch(ghEmailsUrl).then(res => res.json())
  const addresses = ghEmails.map(e => e.email)
  if (addresses.length === 0) throw Error('No email addresses are associated with this user.')
  const getUserId = userIdWithEmail.bind(this)
  let userID = yield getUserId(addresses).then(cursor => cursor.next()).catch(() => null)  
  const ioEmails = ghEmails.map(email => {
    email.primary = email.primary === 'primary' ? 'github' : null
    return email
  })
  if (!userID) {
    userID = nonce(6)
    yield r.db(this.rdbname).table(this.utable)
    .insert({id: userID, emails: ioEmails, tokens: {github: token}}, {returnChanges: true})
    .run(this.rconn)
  } else {
    yield r.db(this.rdbname).table(this.utable).get(userID)
    .update({emails: ioEmails, tokens: {github: token}}, {returnChanges: true})
    .run(this.rconn)
  }
  // userID = user.changes[0].new_val.id
  const payload = {userID}
  const jwt = jsonwebtoken.sign(payload, JWT_SECRET)
  return jwt
}
