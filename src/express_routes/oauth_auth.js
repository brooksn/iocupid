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
  const ghUserUrl = `https://api.github.com/user?access_token=${token}`
  const ghEmailsUrl = `https://api.github.com/user/emails?access_token=${token}`
  const ghUserReq = fetch(ghUserUrl).then(res => res.json())
  const ghEmailsReq = fetch(ghEmailsUrl).then(res => res.json())
  const responses = yield Promise.all([ghUserReq, ghEmailsReq])
  const ghUsername = responses[0].login
  if (typeof ghUsername !== 'string') throw new Error(ghUsername)
  const ghEmails = responses[1]
  const addresses = ghEmails.map(e => e.email)
  if (addresses.length === 0) throw Error('No email addresses are associated with this user.')
  const getUserId = userIdWithEmail.bind(this)
  let userID = yield getUserId(addresses).then(cursor => cursor.next()).catch(() => null)  
  const ioEmails = ghEmails.map(ghEmail => {
    const e = {email: ghEmail.email}
    if (ghEmail.primary === true) e.primary = true
    return e
  })
  const rethinkRow = {emails: ioEmails, services: {github: {token, username: ghUsername}}}
  if (!userID) {
    userID = nonce(6)
    rethinkRow.id = userID
    var res = yield r.db(this.rdbname).table(this.utable)
    .insert(rethinkRow, {returnChanges: true}).run(this.rconn)
  } else {
    res = yield r.db(this.rdbname).table(this.utable).get(userID)
    .update(rethinkRow, {returnChanges: true}).run(this.rconn)
  }
  const user = res.changes[0].new_val
  const payload = {userID, services: user.services}
  const jwt = jsonwebtoken.sign(payload, JWT_SECRET)
  return jwt
}
