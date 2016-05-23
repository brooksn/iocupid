import 'whatwg-fetch'
const HOSTNAME = process.env.HOSTNAME

export default function finishGitHubAuth(code) {
  const p = new Promise((resolve, reject) => {
    fetch(`${HOSTNAME}/api/oauth_auth?code=${code}`)
    .then(res => res.text())
    .then(jwt => resolve(jwt))
    .catch(err => reject(err))
  })
  return p
}
