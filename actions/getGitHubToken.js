import fetch from 'node-fetch'
const ghsecret = process.env.GITHUB_CLIENT_SECRET
const ghid = process.env.GITHUB_CLIENT_ID
const ghtokenurl = 'https://github.com/login/oauth/access_token'

export default function getGitHubToken(code){
  let p = new Promise((resolve, reject) => {
    fetch(`${ghtokenurl}?client_id=${ghclientid}&client_secret=${ghclientsecret}&code=${code}`, {
      method: 'POST'
    })
    .then(res => res.text())
    .then(text => {
      let tokenData = text.split('&').map(field => {
        let x = {}
        let s = field.split('=')
        x[s[0]] = s[1] || null
        return x
      })
      if (tokenData.access_token) resolve(tokenData.access_token)
      else reject(text)
    })
    .catch(err => reject(err))
  })
  return p
}
