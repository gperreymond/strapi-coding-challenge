const db = require('../../../data/db')

const handler = async function (ctx) {
  try {
    this.logger.info(ctx.action.name, ctx.params)
    const { planetCode, limit } = ctx.params
    const data = await db('space_centers').where('planet_code', planetCode).limit(limit)
    return data
  } catch (e) {
    /* istanbul ignore next */
    this.logger.error(ctx.action.name, e.message)
    /* istanbul ignore next */
    return Promise.reject(e)
  }
}

module.exports = handler
