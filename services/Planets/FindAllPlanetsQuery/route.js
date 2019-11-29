const handler = async ({ $moleculer }) => {
  try {
    const data = await $moleculer.call('Planets.FindAllPlanetsQuery')
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
  path: '/api/planets',
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
    auth: false,
    log: { collect: true },
    tags: ['api', 'Planets'],
    description: 'Returns the list of all planets'
  }
}
