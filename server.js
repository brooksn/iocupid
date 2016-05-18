require('dotenv').config({silent: true})
const PORT = process.env.PORT || 8080
const path = require('path')
const fetch = require('node-fetch')
const emoji = require('node-emoji')
const express = require('express')
const app = express()
const PATH_NOT_API_PUBLIC = /\/(?!public|api)\w*/i
const ghsecret = process.env.GITHUB_CLIENT_SECRET
const ghid = process.env.GITHUB_CLIENT_ID
const ghtokenurl = 'https://github.com/login/oauth/access_token'

app.use(express.static('build'))
app.use('/css', express.static('css'))
app.use('/bootswatch', express.static('bootswatch'))
app.use('/bootswatch-3.3.6-dist', express.static('bootswatch-3.3.6-dist'))

app.get('/api/oauth_auth', (req, res) => {
  console.log('got here.')
  // console.log(JSON.stringify(req.query))
  console.log('code: ' + req.query.code + ' state: ' + req.query.state)
  fetch(`https://github.com/login/oauth/access_token?client_id=${ghid}&client_secret=${ghsecret}&code=${req.query.code}`, {
    method: 'POST'
  })
  .then(res => res.text())
  .then(text => {
    let token = text.split('&').map(field => {
      let x = {}
      let s = field.split('=')
      x[s[0]] = s[1] || null
      return x
    })
    // use token to get username, email
    // create or update ioCupid user with token, username, email
    // create JWT
    // res.send(JWT)
    console.log('text on server: ' + text)
    console.log('token on server: ' + JSON.stringify(token))
    return fetch(`https://api.github.com/user?access_token=${token.access_token}`)
  })
  .then(r => r.json())
  .then(json => {
    console.log('made it!!!!')
    console.log(JSON.stringify(json))
    res.send(json)
  })
  .catch(err => console.log(err))
})

app.get(PATH_NOT_API_PUBLIC, (req, res) => res.sendFile(path.join(__dirname, '/index.html')))

app.listen(PORT, () => console.log(emoji.emojify(`ioCupid server started on port ${PORT}! :heart:`)))
