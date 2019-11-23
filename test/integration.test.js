const Moleculer = require('../modules/Moleculer')
const Server = require('../modules/Server')
const GraphQL = require('../modules/GraphQL')

let moleculer
let apollo
let server

const start = async function () {
  try {
    // Moleculer on nats (Services)
    moleculer = new Moleculer()
    moleculer.on('error', err => { throw err })
    await moleculer.start()
    // Server (Gateway)
    server = new Server()
    server.on('error', err => { throw err })
    server.getInstance().decorate('request', '$moleculer', moleculer.getInstance())
    await server.start()
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
    await server.stop()
  })
})
