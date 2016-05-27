const server = require('./server.js')
const emoji = require('node-emoji')
server.once('server started', port => {
  const w = process.env.NODE_ENV === 'development' ? ' :construction:' : ''
  console.log(emoji.emojify(`ioCupid server started on port ${port}! :heart: ${w}`)) // eslint-disable-line 
})
