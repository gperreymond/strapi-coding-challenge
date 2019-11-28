const Joi = require('@hapi/joi')

const handler = async (request) => {
  try {
    console.log(request.query)
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
    validate: {
      query: {
        page: Joi.number().min(1).max(100).default(1).required().description('Page number for the result')
      }
    },
    plugins: {
      'hapi-swagger': {
        payloadType: 'form',
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
