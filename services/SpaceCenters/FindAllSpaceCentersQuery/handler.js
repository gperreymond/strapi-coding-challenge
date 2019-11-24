const db = require('../../../data/db')

const handler = async function (ctx) {
  try {
    ctx.broker.logger.warn(ctx.action.name, ctx.params)
    const { skip, limit } = ctx.params
    const data = db('space_centers').skip(skip).limit(limit)
    return data
  } catch (e) {
    ctx.broker.logger.error(ctx.action.name, e.message)
    return Promise.reject(e)
  }
}

module.exports = handler
