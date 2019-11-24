const debug = require('debug')('application:main'.padEnd(25, ' '))

const Moleculer = require('./modules/Moleculer')
const Gateway = require('./modules/Gateway')
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
    // Gateway (Hapi server)
    const gateway = new Gateway()
    gateway.on('error', err => { throw err })
    gateway.getInstance().decorate('request', '$moleculer', moleculer.getInstance()) // add molecuer instance to request
    await gateway.start()
    // GraphQL
    const params = { moleculer: moleculer.getInstance() } // add moleculer instance to apollo context
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
