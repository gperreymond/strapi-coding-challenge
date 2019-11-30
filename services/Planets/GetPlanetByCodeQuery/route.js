const Joi = require('joi')

const handler = async ({ $moleculer, params: { code } }) => {
  try {
    const data = await $moleculer.call('Planets.GetPlanetByCodeQuery', { code })
    return data
  } catch (e) {
    /* istanbul ignore next */
    $moleculer.logger.error('Planets.FindAllPlanetsQuery', e.message)
    /* istanbul ignore next */
    return Promise.reject(e)
  }
}

module.exports = {
  method: 'get',
  path: '/api/planets/code/{code}',
  handler,
  options: {
    validate: {
      params: {
        code: Joi.string().required()
      }
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: { description: 'Success' },
          500: { description: 'Internal Server Error' }
        }
      }
    },
    auth: false,
    log: { collect: true },
    tags: ['api', 'Planets'],
    description: 'Returns a planet by his code'
  }
}
