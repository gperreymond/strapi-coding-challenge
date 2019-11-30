const debug = require('debug')('application:server'.padEnd(25, ' '))

const EventEmitter = require('events')
const { inherits } = require('util')
const path = require('path')
const colors = require('colors')
const glob = require('glob-promise')
const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')
const HapiSwagger = require('hapi-swagger')
const HapiAuthBasic = require('@hapi/basic')

const Configuration = require('../config')

const getRoutes = () => {
  const files = glob.sync(path.resolve(__dirname, '../', 'services/**/route.js'))
  const routes = []
  /* istanbul ignore if */
  if (files.length === 0) { return routes }
  do {
    const file = files.shift()
    const route = require(file)
    routes.push(route)
  } while (files.length)
  return routes
}

const validateBasic = async (request, username, password) => {
  const { auth: { basic } } = Configuration
  const isValid = (username === basic.username && password === basic.password)
  return { isValid, credentials: { name: basic.username } }
}

class Gateway {
  constructor () {
    this._instance = new Hapi.Server({
      host: Configuration.gateway.hostname,
      port: Configuration.gateway.port,
      routes: {
        cors: true
      }
    })
    EventEmitter.call(this)
  }

  getInstance () {
    return this._instance
  }

  async plugins () {
    // inert and vision
    await this.getInstance().register([Inert, Vision])
    debug('Plugin Inert, Vision are registered')
    // basic auth
    await this.getInstance().register(HapiAuthBasic)
    this.getInstance().auth.strategy('simple', 'basic', { validate: validateBasic })
    debug('Plugin HapiAuthBasic is registered')
    // swagger auto documentation
    const swaggerOptions = {
      info: {
        title: 'API Documentation',
        version: Configuration.version
      },
      consumes: ['application/x-www-form-urlencoded', 'application/json'],
      payloadType: 'form',
      securityDefinitions: {
        BasicAuth: { type: 'basic' },
        ApiKeyAuth: { type: 'apiKey', in: 'header', name: 'Authorization' }
      },
      schemes: ['http', 'https'],
      grouping: 'tags'
    }
    await this.getInstance().register({ plugin: HapiSwagger, options: swaggerOptions })
    debug('Plugin HapiSwagger is registered')
  }

  async routes () {
    debug('Detecting server exposed routes')
    try {
      const routes = getRoutes()
      /* istanbul ignore if */
      if (routes.length === 0) { return true }
      do {
        const route = routes.shift()
        let selectedColor = 'green'
        route.options.plugins['hapi-swagger'].security = []
        if (route.options.auth === 'simple') {
          selectedColor = 'yellow'
          route.options.plugins['hapi-swagger'].security = [{ BasicAuth: [] }]
        }
        debug(`Route ${colors[selectedColor](route.method)} ${colors[selectedColor](route.path)} is registered with auth: ${colors[selectedColor](route.options.auth)}`)
        await this.getInstance().route(route)
      } while (routes.length > 0)
      return true
    } catch (e) {
      /* istanbul ignore next */
      this.emit('error', e)
      /* istanbul ignore next */
      return Promise.reject(e)
    }
  }

  async start () {
    try {
      await this.plugins()
      await this.routes()
      await this.getInstance().start()
      debug(`Gateway Server started on port: ${Configuration.gateway.port}`)
      return true
    } catch (e) {
      /* istanbul ignore next */
      this.emit('error', e)
      /* istanbul ignore next */
      return Promise.reject(e)
    }
  }
}

inherits(Gateway, EventEmitter)
module.exports = Gateway
