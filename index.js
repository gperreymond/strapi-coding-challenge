const debug = require('debug')('application:main'.padEnd(25, ' '))

const Moleculer = require('./modules/Moleculer')
const Server = require('./modules/Server')
const GraphQL = require('./modules/GraphQL')
const Configuration = require('./config')

debug(`Starting application: ${Configuration.env}`)

const captureException = function (err) {
  debug('Something went wrong', err.name)
  console.log(err)
  setTimeout(() => {
    process.exit(1)
  }, 250)
}
process.on('uncaughtException', captureException)
process.on('exit', (n) => {
  if (n !== 0) { captureException(new Error('Node process has exit...')) }
})

const start = async function () {
  try {
    // Moleculer on nats (Services)
    const moleculer = new Moleculer()
    moleculer.on('error', err => { throw err })
    await moleculer.start()
    // Server (Gateway)
    const server = new Server()
    server.on('error', err => { throw err })
    server.getInstance().decorate('request', '$moleculer', moleculer.getInstance())
    await server.start()
    // GraphQL
    const params = { moleculer: moleculer.getInstance() }
    const apollo = new GraphQL(params)
    await apollo.start()
    debug('Application started')
  } catch (e) {
    console.log('******************** ERROR')
    return Promise.reject(e)
  }
}

start().catch(err => {
  console.log(err)
  process.exit(1)
})
