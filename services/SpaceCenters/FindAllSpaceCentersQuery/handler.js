const db = require('../../../data/db')

const handler = async function (ctx) {
  try {
    ctx.broker.logger.warn(ctx.action.name, ctx.params)
    const { skip, limit } = ctx.params
    const data = db('space_centers').offset(skip).limit(limit)
    return data
  } catch (e) {
    /* istanbul ignore next */
    ctx.broker.logger.error(ctx.action.name, e.message)
    /* istanbul ignore next */
    return Promise.reject(e)
  }
}

module.exports = handler
