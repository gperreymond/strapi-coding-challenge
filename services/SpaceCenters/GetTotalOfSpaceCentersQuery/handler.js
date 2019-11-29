const db = require('../../../data/db')

const handler = async function (ctx) {
  try {
    ctx.broker.logger.warn(ctx.action.name, ctx.params)
    const [{ count: total }] = await db('space_centers').count('id')
    return { total }
  } catch (e) {
    /* istanbul ignore next */
    ctx.broker.logger.error(ctx.action.name, e.message)
    /* istanbul ignore next */
    return Promise.reject(e)
  }
}

module.exports = handler
