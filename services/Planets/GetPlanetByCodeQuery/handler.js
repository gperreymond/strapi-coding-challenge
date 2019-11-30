const Boom = require('@hapi/boom')

const db = require('../../../data/db')

const handler = async function (ctx) {
  try {
    this.logger.info(ctx.action.name, ctx.params)
    const { code } = ctx.params
    const data = await db('planets').where({ code })
    if (data.length === 0) { return Boom.notFound('Planet not found') }
    return data[0]
  } catch (e) {
    /* istanbul ignore next */
    this.logger.error(ctx.action.name, e.message)
    /* istanbul ignore next */
    return Promise.reject(e)
  }
}

module.exports = handler
