const debug = require('debug')('application:graphql'.padEnd(25, ' '))

const EventEmitter = require('events')
const { inherits } = require('util')
const { ApolloServer, gql } = require('apollo-server')

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
    this.addDef(require('../models/graphql/Models'))
    this.addDef(require('../models/graphql/Queries'))
    EventEmitter.call(this)
  }

  addResolvers () {
    const r = require('../models/graphql/Resolvers')
    if (r.Query) {
      const queries = Object.keys(r.Query)
      queries.map(key => {
        this._resolvers.Query[key] = async (_, args, ctx) => ctx.$moleculer.call(r.Query[key], args)
      })
    }
  }

  addDef (content) {
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
      await this._instance.listen({ port: 3000 })
      debug('Server started')
      return true
    } catch (e) {
      this.emit('error', e)
      return Promise.reject(e)
    }
  }
}

inherits(GraphQL, EventEmitter)
module.exports = GraphQL
