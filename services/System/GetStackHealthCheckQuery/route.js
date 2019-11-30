const Configuration = require('../../../config')

const handler = async ({ $moleculer }) => {
  try {
    const { env, name, version, commit } = Configuration
    return {
      env,
      name,
      version,
      commit
    }
  } catch (e) {
    /* istanbul ignore next */
    $moleculer.logger.error('System.GetStackHealthCheckQuery', e.message)
    /* istanbul ignore next */
    return Promise.reject(e)
  }
}

module.exports = {
  method: 'get',
  path: '/hc',
  handler,
  options: {
    plugins: {
      'hapi-swagger': {
        responses: {
          200: { description: 'Success' },
          500: { description: 'Internal Server Error' }
        }
      }
    },
    auth: 'simple',
    log: { collect: false },
    tags: ['api', 'System'],
    description: 'Get the healthcheck of the gateway'
  }
}
