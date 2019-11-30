const db = require('../../../data/db')

const handler = async function (ctx) {
  try {
    this.logger.info(ctx.action.name, ctx.params)
    const [{ count: total }] = await db('space_centers').count('id')
    return { total }
  } catch (e) {
    /* istanbul ignore next */
    this.logger.error(ctx.action.name, e.message)
    /* istanbul ignore next */
    return Promise.reject(e)
  }
}

module.exports = handler
