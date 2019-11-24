const handler = async (request) => {
  try {
    const data = await request.$moleculer.call('Planets.FindAllPlanetsQuery')
    return data
  } catch (e) {
    return e
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
