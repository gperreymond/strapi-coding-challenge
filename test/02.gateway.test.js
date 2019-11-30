const axios = require('axios')

const Gateway = require('../modules/Gateway')

let gateway

describe('[Unit] The module Gateway', () => {
  beforeAll(async () => {
    gateway = new Gateway()
    await gateway.plugins()
    await gateway.routes()
    await gateway.getInstance().route({
      method: 'get',
      path: '/auth/basic',
      options: {
        auth: 'simple'
      },
      handler: () => { return {} }
    })
    await gateway.getInstance().start()
  })
  test('should failed because the auth basic is not used', async () => {
    try {
      await axios.get('http://localhost:7070/auth/basic')
      expect(true).toEqual(false)
    } catch (e) {
      expect(e.message).toEqual('Request failed with status code 401')
    }
  })
  test('should failed because the auth basic is not good', async () => {
    try {
      await axios.get('http://localhost:7070/auth/basic', {
        auth: {
          username: 'infra',
          password: 's00pers3cret'
        }
      })
      expect(true).toEqual(false)
    } catch (e) {
      expect(e.message).toEqual('Request failed with status code 401')
    }
  })
  test('should return 200 because the auth basic is good', async () => {
    try {
      const { status } = await axios.get('http://localhost:7070/auth/basic', {
        auth: {
          username: 'infra',
          password: 'infra'
        }
      })
      expect(status).toEqual(200)
    } catch (e) {
      expect(e.message).toEqual(null)
    }
  })
  afterAll(async () => {
    await gateway.getInstance().stop()
  })
})
