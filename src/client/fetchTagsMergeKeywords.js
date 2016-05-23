const fs = require('fs')
const fetch = require('node-fetch')

let keywords = JSON.parse(fs.readFileSync('./keywords.json'))

let promises = []
for (let i = 1; i <= 20; i++) {
  promises.push(fetch(`https://api.stackexchange.com/2.2/tags?page=${i}&order=desc&sort=popular&site=stackoverflow`))
}

Promise.all(promises)
  .then(results => Promise.all(results.map(result => result.json())))
  .then(json => json.map(x => x.items).reduce((a, b) => a.concat(b)).map(r => r.name))
  .then(array => {
    fs.writeFileSync('popularStackOverflowTags.json', JSON.stringify(array, null, '  ') + '\n', 'utf8')
    return array
  })
  .then(tags => {
    let terms = keywords.concat(tags.filter(val => keywords.indexOf(val) < 0))
    fs.writeFileSync('mergedKeywords.json', JSON.stringify(terms, null, '  ') + '\n', 'utf8')
  })
