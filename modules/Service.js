const debug = require('debug')('application:moleculer'.padEnd(25, ' '))

const path = require('path')
const glob = require('glob-promise')
const fse = require('fs-extra')

const getCommands = (domain) => {
  const files = glob.sync(`${path.resolve(__dirname, '../services', domain)}/*Command/handler.js`)
  const actions = {}
  if (files.length === 0) { return actions }
  do {
    const file = files.shift()
    const basename = path.basename(path.resolve(file, '..'))
    const basepath = path.resolve(file, '..')
    const action = {
      handler: require(`${basepath}/handler.js`)
    }
    if (fse.pathExistsSync(`${basepath}/params.js`)) { action.params = require(`${basepath}/params.js`) }
    debug(`Domain ${domain}, Command ${basename} has been found`)
    actions[basename] = action
  } while (files.length)
  return actions
}

const getQueries = (domain) => {
  const files = glob.sync(`${path.resolve(__dirname, '../services', domain)}/*Query/handler.js`)
  const actions = {}
  if (files.length === 0) { return actions }
  do {
    const file = files.shift()
    const basename = path.basename(path.resolve(file, '..'))
    const basepath = path.resolve(file, '..')
    const action = {
      handler: require(`${basepath}/handler.js`)
    }
    if (fse.pathExistsSync(`${basepath}/params.js`)) { action.params = require(`${basepath}/params.js`) }
    debug(`Domain ${domain}, Query ${basename} has been found`)
    actions[basename] = action
  } while (files.length)
  return actions
}

const getEvents = (domain) => {
  const files = glob.sync(`${path.resolve(__dirname, '../services', domain)}/*Event/handler.js`)
  const events = {}
  if (files.length === 0) { return events }
  do {
    const file = files.shift()
    const basename = path.basename(path.resolve(file, '..'))
    const basepath = path.resolve(file, '..')
    const event = {
      handler: require(`${basepath}/handler.js`)
    }
    debug(`Domain ${domain}, Event ${basename} has been found`)
    events[`${domain}.${basename}`] = event
  } while (files.length)
  return events
}

const getMethods = (domain) => {
  const files = glob.sync(`${path.resolve(__dirname, '../services', domain)}/methods.js`)
  if (files.length === 0) { return {} }
  debug(`Domain ${domain}, Methods has been found`)
  const methods = require(`${path.resolve(__dirname, '../services', domain)}/methods.js`)
  return methods
}

class Service {
  constructor (name) {
    const methods = getMethods(`${name}`)
    const queries = getQueries(`${name}`)
    const commands = getCommands(`${name}`)
    const actions = {
      ...queries,
      ...commands
    }
    const events = getEvents(`${name}`)
    this._name = name
    this._instance = {
      name,
      actions,
      events,
      methods,
      created () {
      },
      async started () {
        debug(`Service ${this.name} has started`)
      },
      async stopped () {
      }
    }
  }

  getInstance () {
    return this._instance
  }
}

module.exports = Service
