const githubToken = require('../actions/githubTokenInfoFromOauthCode.js')
const slackToken = require('../actions/slackTokenInfoFromOauthCode.js')
const nonce = require('../nonce.js')
const userIdWithEmails = require('../db/rethinkUserIdWithEmails.js')
const upsertUser = require('../db/upsertUser.js')
const r = require('rethinkdb')
const has = require('lodash').has
const wrap = require('common-tags').oneLine
const jsonwebtoken = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

module.exports = function* oauth_auth(code, serviceName) {
  if (!this.rconn || !this.rdbname || !this.utable) {
    throw Error('this.rconn, this.dbname, and this.utable are required.')
  }
  const getUserId = userIdWithEmails.bind(this)
  const upsert = upsertUser.bind(this)
  
  let authorizedUser
  switch (serviceName) {
    case 'github':
      authorizedUser = yield githubToken(code)
      break;
    case 'slack': 
      authorizedUser = yield slackToken(code)
      break;
    default:
      throw new Error('Parameter "service" in oauth_auth was not an allowed value. ')
  }

  const addresses = authorizedUser.emails.map(e => e.address)

  if (addresses.length === 0) {
    throw Error(wrap`No email addresses were associated with ${serviceName}
      user ${authorizedUser.service.id || authorizedUser.service.username}. `)
  }
  
  let userID = yield getUserId(addresses).then(cursor => cursor.next()).catch(() => null)

  userID = userID || nonce(6)

  const rethinkRow = {emails: authorizedUser.emails, services: {}}
  rethinkRow.services[serviceName] = authorizedUser.service

  const res = yield upsert(userID, rethinkRow, serviceName)

  const user = has(res, 'changes[0].new_val')
    ? res.changes[0].new_val
    : yield r.db(this.rdbname).table(this.utable).get(userID).run(this.rconn)

  const payload = {userID, services: user.services}

  const jwt = jsonwebtoken.sign(payload, JWT_SECRET)
  
  return jwt
}
