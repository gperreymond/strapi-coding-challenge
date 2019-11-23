const nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf.json' })

// ************************************
// Typecasting from kube env
// ************************************
let APP_MOLECULER_LOGGER = true
let APP_GATEWAY_PORT = 7000
let APP_APOLLO_PORT = 3000
let APP_RABBITMQ_PORT = 5672
let APP_NATS_PORT = 4222
let APP_POSTGRES_PORT = 5432
// ************************************
if (nconf.get('APP_MOLECULER_LOGGER')) { APP_MOLECULER_LOGGER = nconf.get('APP_MOLECULER_LOGGER') === 'true' }
if (nconf.get('APP_GATEWAY_PORT')) { APP_GATEWAY_PORT = parseInt(nconf.get('APP_GATEWAY_PORT')) }
if (nconf.get('APP_APOLLO_PORT')) { APP_APOLLO_PORT = parseInt(nconf.get('APP_APOLLO_PORT')) }
if (nconf.get('APP_RABBITMQ_PORT')) { APP_RABBITMQ_PORT = parseInt(nconf.get('APP_RABBITMQ_PORT')) }
if (nconf.get('APP_NATS_PORT')) { APP_NATS_PORT = parseInt(nconf.get('APP_NATS_PORT')) }
if (nconf.get('APP_POSTGRES_PORT')) { APP_POSTGRES_PORT = parseInt(nconf.get('APP_POSTGRES_PORT')) }
// ************************************

module.exports = {
  env: process.env.NODE_ENV || 'development',
  name: require('../package.json').name,
  version: require('../package.json').version,
  commit: `${require('../package.json').homepage || ''}/commit/${nconf.get('APP_LAST_COMMIT') || 'localhost'}`,
  gateway: {
    hostname: nconf.get('APP_GATEWAY_HOSTNAME') || '0.0.0.0',
    port: APP_GATEWAY_PORT
  },
  rabbitmq: {
    hostname: nconf.get('APP_RABBITMQ_HOSTNAME') || 'localhost',
    port: APP_RABBITMQ_PORT,
    username: nconf.get('APP_RABBITMQ_USERNAME') || 'infra',
    password: nconf.get('APP_RABBITMQ_PASSWORD') || 'infra'
  },
  nats: {
    hostname: nconf.get('APP_NATS_HOSTNAME') || 'localhost',
    port: APP_NATS_PORT,
    username: nconf.get('APP_NATS_USERNAME') || 'infra',
    password: nconf.get('APP_NATS_PASSWORD') || 'infra',
    maxReconnectAttempts: 3
  },
  postgres: {
    hostname: nconf.get('APP_POSTGRES_HOSTNAME') || 'localhost',
    port: APP_POSTGRES_PORT,
    username: nconf.get('APP_POSTGRES_USERNAME') || 'infra',
    password: nconf.get('APP_POSTGRES_PASSWORD') || 'infra'
  },
  apollo: {
    port: APP_APOLLO_PORT
  },
  moleculer: {
    logger: APP_MOLECULER_LOGGER
  },
  auth: {
    basic: {
      username: nconf.get('APP_AUTH_BASIC_USERNAME') || 'infra',
      password: nconf.get('APP_AUTH_BASIC_PASSWORD') || 'infra'
    }
  }
}
