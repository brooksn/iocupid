const fetch = require('node-fetch')
const co = require('co')
const wrapUrl = require('common-tags').oneLineTrim
const SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID
const SLACK_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET

module.exports = co.wrap(function* slackTokenInfoFromOauthCode(code) {
  const slackTokenURL = wrapUrl`https://slack.com/api/oauth.access
  ?client_id=${SLACK_CLIENT_ID}
  &client_secret=${SLACK_CLIENT_SECRET}
  &code=${code}`
  const res = yield fetch(slackTokenURL)
  if (res.status < 200 || res.status >= 300) throw new Error(res)
  const json = yield res.json()
  const user = {}
  user.service = {
    token: json.access_token,
    id: json.user.id,
    name: json.user.name,
    avatar: json.user.image_512 || json.user.image_192 || json.user.image_72,
    teamId: json.team.id,
    teamDomain: json.team.domain,
    teamAvatar: json.team.image_230 || json.team.image_102 || json.team.image_88
  }
  user.emails = []
  if (json.user.email) user.emails.push({address: json.user.email, public: false, primary: true})
  return user
})
