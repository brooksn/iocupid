import 'whatwg-fetch'
const HOSTNAME = process.env.HOSTNAME

export default function finishOauth(code, state, service) {
  const p = new Promise((resolve, reject) => {
    fetch(`${HOSTNAME}/api/oauth_auth?code=${code}&service=${service}`)
    .then(res => {
      if (res.status < 200 || res.status >= 300) {
        throw new Error('Bad response from finishOauth')
      }
      return res
    })
    .then(res => res.text())
    .then(jwt => resolve(jwt))
    .catch(err => reject(err))
  })
  return p
}
