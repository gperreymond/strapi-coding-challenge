const Joi = require('@hapi/joi')

const handler = async ({ query: { page, pageSize }, $moleculer }) => {
  try {
    if (!page) { page = 1 }
    if (!pageSize) { pageSize = 10 }
    const data = await $moleculer.call('SpaceCenters.FindAllSpaceCentersQuery', { skip: (page - 1) * pageSize, limit: pageSize })
    return data
  } catch (e) {
    /* istanbul ignore next */
    $moleculer.logger.error('SpaceCenters.FindAllSpaceCentersQuery', e.message)
    /* istanbul ignore next */
    return Promise.reject(e)
  }
}

module.exports = {
  method: 'get',
  path: '/api/spaceCenters',
  handler,
  options: {
    validate: {
      query: Joi.object({
        page: Joi.number().integer().min(1).description('Result page index'),
        pageSize: Joi.number().integer().min(1).description('Number of items returned per page')
      })
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
