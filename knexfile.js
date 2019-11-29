const { postgres } = require('./config')

const conn = {
  client: 'pg',
  version: '9.6',
  connection: {
    host: postgres.hostname,
    port: postgres.port,
    user: postgres.username,
    password: postgres.password,
    database: 'infra'
  }
}

module.exports = {
  development: {
    ...conn,
    migrations: {
      directory: './data/migrations'
    },
    seeds: { directory: './data/seeds' }
  },
  test: {
    client: 'sqlite3',
    connection: {
      filename: './test.sqlite'
    },
    migrations: {
      directory: './data/migrations'
    },
    seeds: { directory: './data/seeds-test' }
  },
  demo: {
    ...conn
  },
  production: {
    ...conn
  }
}
