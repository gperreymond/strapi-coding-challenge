const Moleculer = require('../modules/Moleculer')
const Gateway = require('../modules/Gateway')
const GraphQL = require('../modules/GraphQL')

let moleculer
let apollo
let gateway

const start = async function () {
  try {
    // Moleculer on nats (Services)
    moleculer = new Moleculer()
    moleculer.on('error', err => { throw err })
    await moleculer.start()
    // Gateway (Hapi server)
    gateway = new Gateway()
    gateway.on('error', err => { throw err })
    gateway.getInstance().decorate('request', '$moleculer', moleculer.getInstance())
    await gateway.start()
    // GraphQL
    const params = { moleculer: moleculer.getInstance() }
    apollo = new GraphQL(params)
    await apollo.start()
  } catch (e) {
    return Promise.reject(e)
  }
}

describe('[Integration] The global application', () => {
  beforeAll(async () => {
    await start()
  })
  test('should start', async () => {
    expect(true).toEqual(true)
  })
  afterAll(async () => {
    await moleculer.stop()
    await apollo.stop()
    await gateway.stop()
  })
})
