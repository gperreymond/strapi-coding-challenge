const { postgres } = require('./config')

module.exports = {
  development: {
    client: 'pg',
    version: '9.6',
    connection: {
      host: postgres.hostname,
      port: postgres.port,
      user: postgres.username,
      password: postgres.password,
      database: 'infra'
    },
    migrations: {
      directory: './data/migrations'
    },
    seeds: { directory: './data/seeds' }
  }
}
