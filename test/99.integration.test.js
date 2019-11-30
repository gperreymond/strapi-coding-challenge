const axios = require('axios')

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
  test('should call the gateway healthcheck and return 200', async () => {
    try {
      const { data: json } = await axios.get('http://localhost:7070/hc', {
        auth: {
          username: 'infra',
          password: 'infra'
        }
      })
      expect(json.env).toEqual('test')
      expect(json.name).toEqual('strapi-coding-challenge')
    } catch (e) {
      expect(e).toEqual(null)
    }
  })
  test('should call the gateway api planets and return 200', async () => {
    try {
      const { data: json } = await axios.get('http://localhost:7070/api/planets')
      expect(json.length).toEqual(15)
    } catch (e) {
      expect(e).toEqual(null)
    }
  })
  test('should call the gateway api planet get by code and return 200', async () => {
    try {
      const { data: json } = await axios.get('http://localhost:7070/api/planets/code/MER')
      expect(json.code).toEqual('MER')
    } catch (e) {
      expect(e).toEqual(null)
    }
  })
  test('should call the gateway api planet get by code and return 404', async () => {
    try {
      await axios.get('http://localhost:7070/api/planets/code/TOTO')
    } catch (e) {
      const { response: { data: { statusCode, error, message } } } = e
      expect(statusCode).toEqual(404)
      expect(error).toEqual('Not Found')
      expect(message).toEqual('Planet not found')
    }
  })
  test('should call the gateway api spaceCenters and return 200, with no query params', async () => {
    try {
      const { data: json } = await axios.get('http://localhost:7070/api/spaceCenters')
      expect(json.length).toEqual(10)
    } catch (e) {
      expect(e).toEqual(null)
    }
  })
  test('should call the gateway api spaceCenters and return 200, with query params (page)', async () => {
    try {
      const { data: json } = await axios.get('http://localhost:7070/api/spaceCenters?page=2')
      expect(json.length).toEqual(10)
    } catch (e) {
      expect(e).toEqual(null)
    }
  })
  test('should call the gateway api spaceCenters and return 200, with query params (page, pageSize)', async () => {
    try {
      const { data: json } = await axios.get('http://localhost:7070/api/spaceCenters?page=1&pageSize=5')
      expect(json.length).toEqual(5)
    } catch (e) {
      expect(e).toEqual(null)
    }
  })
  test('should call apollo server and return a 500', async () => {
    try {
      await axios.post('http://localhost:3030/graphql')
    } catch (e) {
      expect(e.message).toEqual('Request failed with status code 500')
    }
  })
  test('should call apollo server and return query on planets', async () => {
    try {
      const { data: json } = await axios.post('http://localhost:3030/graphql', {
        query: `
          query planets {
            planets {
              id
              name
              code
              spaceCenters(limit: 2) {
                id
                name
              }
            }
          }
        `
      })
      expect(json.data.planets.length).toEqual(15)
    } catch (e) {
      expect(e.message).toEqual(null)
    }
  })
  test('should call apollo server and return query on spaceCenters with params (page)', async () => {
    try {
      const { data: json } = await axios.post('http://localhost:3030/graphql', {
        query: `
          query spaceCenters {
            spaceCenters(page: 2) {
              pagination {
                total
                page
                pageSize
              }
              nodes {
                id
                uid
                name
                description
                latitude
                longitude
                planet {
                  id
                  name
                  code
                }
              }
            }
          }
        `
      })
      expect(json.data.spaceCenters.nodes.length).toEqual(10)
    } catch (e) {
      expect(e.message).toEqual(null)
    }
  })
  test('should call apollo server and return query on spaceCenters with params (pageSize)', async () => {
    try {
      const { data: json } = await axios.post('http://localhost:3030/graphql', {
        query: `
          query spaceCenters {
            spaceCenters(pageSize: 5) {
              pagination {
                total
                page
                pageSize
              }
              nodes {
                id
                uid
                name
                description
                latitude
                longitude
                planet {
                  id
                  name
                  code
                }
              }
            }
          }
        `
      })
      expect(json.data.spaceCenters.nodes.length).toEqual(5)
    } catch (e) {
      expect(e.message).toEqual(null)
    }
  })
  test('should call apollo server and return query on spaceCenters with params (page and pageSize)', async () => {
    try {
      const { data: json } = await axios.post('http://localhost:3030/graphql', {
        query: `
          query spaceCenters {
            spaceCenters(page: 1, pageSize: 20) {
              pagination {
                total
                page
                pageSize
              }
              nodes {
                id
                uid
                name
                description
                latitude
                longitude
                planet {
                  id
                  name
                  code
                }
              }
            }
          }
        `
      })
      expect(json.data.spaceCenters.nodes.length).toEqual(20)
    } catch (e) {
      expect(e.message).toEqual(null)
    }
  })
  test('should call apollo server and return an error because query on spaceCenter with params (uid) ws not found', async () => {
    try {
      await axios.post('http://localhost:3030/graphql', {
        query: `
          query spaceCenter {
            spaceCenter(uid: "no-no-no-no") {
              id
              uid
              name
              description
              planet {
                id
                name
                code
              }
            }
          }
        `
      })
    } catch (e) {
      expect(e.message).toEqual('Request failed with status code 500')
    }
  })
  test('should call apollo server and return query on spaceCenter with params (uid)', async () => {
    try {
      const { data: json } = await axios.post('http://localhost:3030/graphql', {
        query: `
          query spaceCenter {
            spaceCenter(uid: "da9c2dee-3b38-4d21-b911-083599c05dad") {
              id
              uid
              name
              description
              planet {
                id
                name
                code
              }
            }
          }
        `
      })
      expect(json.data.spaceCenter.uid).toEqual('da9c2dee-3b38-4d21-b911-083599c05dad')
    } catch (e) {
      expect(e.message).toEqual(null)
    }
  })
  afterAll(async () => {
    await moleculer.getInstance().stop()
    await apollo.getInstance().stop()
    await gateway.getInstance().stop()
  })
})
