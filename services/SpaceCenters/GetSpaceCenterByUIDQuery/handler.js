const db = require('../../../data/db')

const handler = async function (ctx) {
  try {
    this.logger.info(ctx.action.name, ctx.params)
    const { uid } = ctx.params
    const data = await db('space_centers').where({ uid })
    if (data.length === 0) { throw new Error('SpaceCenter not found') }
    return data[0]
  } catch (e) {
    /* istanbul ignore next */
    this.logger.error(ctx.action.name, e.message)
    /* istanbul ignore next */
    return Promise.reject(e)
  }
}

module.exports = handler
