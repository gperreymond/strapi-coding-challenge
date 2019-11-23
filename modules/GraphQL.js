const debug = require('debug')('application:graphql'.padEnd(25, ' '))

const EventEmitter = require('events')
const { inherits } = require('util')
const { ApolloServer, gql } = require('apollo-server')

const Configuration = require('../config')

class GraphQL {
  constructor (params) {
    const { moleculer } = params
    this._moleculer = moleculer
    // Get all resolvers
    this._resolvers = {
      Query: {}
    }
    this.addResolvers()
    // Get all typeDefs
    this._typeDefs = ''
    this.addDef(require('../graphql/Models'))
    this.addDef(require('../graphql/Queries'))
    EventEmitter.call(this)
  }

  addResolvers () {
    const r = require('../graphql/Resolvers')
    if (r.Query) {
      const queries = Object.keys(r.Query)
      queries.map(key => {
        debug(`Resolver ${key} has been added`)
        this._resolvers.Query[key] = async (_, args, ctx) => ctx.$moleculer.call(r.Query[key], args)
      })
    }
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
        })
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
