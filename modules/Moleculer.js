const debug = require('debug')('application:moleculer'.padEnd(25, ' '))

const path = require('path')
const glob = require('glob-promise')
const EventEmitter = require('events')
const { inherits } = require('util')
const { ServiceBroker } = require('moleculer')

const Configuration = require('../config')
const Service = require('./Service')

class Moleculer {
  constructor (type, options) {
    debug(`Initializing broker: ${type}`)
    this._type = type
    this._transporter = null
    if (type) {
      this._transporter = {
        type,
        options
      }
    }
    this._instance = new ServiceBroker({
      transporter: this._transporter,
      logLevel: {
        CACHER: false,
        TRANSIT: false,
        REGISTRY: false,
        BROKER: 'warn',
        TRANSPORTER: 'error',
        '**': 'info'
      },
      logger: Configuration.moleculer.logger,
      metrics: true,
      middlewares: [{
        stopped: () => {
          this.emit('error', new Error('Moleculer has stopped'))
        },
        started: () => {
          this.emit('started')
        }
      }]
    })
    this._instance.$loggers = {}
    EventEmitter.call(this)
  }

  getInstance () {
    return this._instance
  }

  async services () {
    debug('Detecting broker services')
    try {
      const services = glob.sync(`${path.resolve(__dirname, '../services')}/*`)
      if (services.length === 0) { return true }
      do {
        const item = services.shift()
        const basename = path.basename(item, '.js')
        const extname = path.extname(item)
        if (extname !== '') {
          // Service is a File
          debug(`Service ${basename} is detected (from file)`)
          this.getInstance().createService(require(item))
        } else {
          // Service is a Configuration
          debug(`Service ${basename} is detected (from configuration)`)
          const service = new Service(basename)
          this.getInstance().createService(service.getInstance())
        }
      } while (services.length > 0)
      return true
    } catch (e) {
      this.emit('error', e)
      return Promise.reject(e)
    }
  }

  async start () {
    try {
      await this.services()
      await this.getInstance().start()
      debug('Moleculer started')
      return true
    } catch (e) {
      /* istanbul ignore next */
      this.emit('error', e)
      /* istanbul ignore next */
      return Promise.reject(e)
    }
  }
}

inherits(Moleculer, EventEmitter)
module.exports = Moleculer
