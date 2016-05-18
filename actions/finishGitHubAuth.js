import fetch from 'node-fetch'

export default function finishGitHubAuth(code){
  let p = new Promise((resolve, reject) => {
    fetch(`/api/oauth_auth?code=${code}`, {
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
