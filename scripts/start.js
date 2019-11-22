const nodemon = require('nodemon')
const options = require('../nodemon.json')

nodemon(options)

nodemon.on('start', function () {
  console.log('Nodemon has started')
}).on('quit', function () {
  console.log('Nodemon has quit')
  process.exit()
}).on('restart', function (files) {
  console.log('Nodemon restarted due to: ', files)
})
