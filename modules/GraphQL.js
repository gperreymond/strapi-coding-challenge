const debug = require('debug')('application:graphql'.padEnd(25, ' '))

const EventEmitter = require('events')
const { inherits } = require('util')
const { ApolloServer, gql } = require('apollo-server')
const responseCachePlugin = require('apollo-server-plugin-response-cache')

const Configuration = require('../config')

class GraphQL {
  constructor (params) {
    const { moleculer } = params
    this._moleculer = moleculer
    // Get all resolvers
    this._resolvers = require('../graphql/Resolvers')
    // Get all typeDefs
    this._typeDefs = ''
    this.addDef(require('../graphql/Schemas'))
    this.addDef(require('../graphql/Queries'))
    EventEmitter.call(this)
  }

  addDef (content) {
    debug('Def has been added')
    this._typeDefs += content
  }

  getInstance () {
    return this._instance
  }

  async start () {
    try {
      this._instance = new ApolloServer({
        tracing: true,
        typeDefs: gql`${this._typeDefs}`,
        resolvers: this._resolvers,
        context: async () => ({
          $moleculer: this._moleculer
        }),
        plugins: [responseCachePlugin()]
      })
      // The `listen` method launches a web server.
      await this._instance.listen({ port: Configuration.apollo.port })
      debug(`Apollo Server started on port: ${Configuration.apollo.port}`)
      return true
    } catch (e) {
      this.emit('error', e)
      return Promise.reject(e)
    }
  }
}

inherits(GraphQL, EventEmitter)
module.exports = GraphQL
