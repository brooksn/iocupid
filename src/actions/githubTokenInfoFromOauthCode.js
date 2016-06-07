const fetch = require('node-fetch')
const co = require('co')
const wrapUrl = require('common-tags').oneLineTrim
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID

module.exports = co.wrap(function* slackTokenInfoFromOauthCode(code) {
  const githubTokenUrl = wrapUrl`https://github.com/login/oauth/access_token
  ?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}`
  const res = yield fetch(githubTokenUrl, {
    method: 'POST', 
    headers: {Accept: 'application/json'}
  })
  if (res.status < 200 || res.status >= 300) throw new Error(res)
  const json = yield res.json()
  const token = json.access_token
  const userUrl = `https://api.github.com/user?access_token=${token}`
  const emailsUrl = `https://api.github.com/user/emails?access_token=${token}`
  const userReq = fetch(userUrl).then(res => res.json())
  const emailsReq = fetch(emailsUrl).then(res => res.json())
  const responses = yield Promise.all([userReq, emailsReq])
  const username = responses[0].login
  const publicEmail = responses[0].email
  const avatar = responses[0].avatar_url
  const gravatarId = responses[0].gravatar_id
  
  if (typeof username !== 'string') throw new Error(username)
  
  const emails = responses[1].filter(e => e.verified === true).map(e => {
    const email = {address: e.email, primary: e.primary,
      public: e.email === publicEmail ? true : false}
    return email
  })

  const user = {service: {token, username, avatar, gravatarId}, emails}
  return user
})
