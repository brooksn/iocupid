import fetch from 'node-fetch'
const HOSTNAME = process.env.HOSTNAME

export default function finishGitHubAuth(code){
  let p = new Promise((resolve, reject) => {
    fetch(`${HOSTNAME}/api/oauth_auth?code=${code}`)
    .then(res => res.json())
    .then(json => resolve(json))
    .catch(err => reject(err))
  })
  return p
}
