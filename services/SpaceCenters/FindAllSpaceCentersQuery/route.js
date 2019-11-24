const handler = async (request) => {
  try {
    const data = await request.$moleculer.call('SpaceCenters.FindAllSpaceCentersQuery')
    return data
  } catch (e) {
    return e
  }
}

module.exports = {
  method: 'get',
  path: '/api/spaceCenters',
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
    description: 'Returns a paginated list of space centers'
  }
}
