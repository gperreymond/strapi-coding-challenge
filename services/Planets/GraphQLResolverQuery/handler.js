const db = require('../../../data/db')

const handler = async function (ctx) {
  try {
    ctx.broker.logger.warn(ctx.action.name, ctx.params)
    const data = await db('planets').map(async function (row) {
      row.spaceCenters = await db('space_centers').where('planet_code', row.code)
      return row
    })
    return data
  } catch (e) {
    ctx.broker.logger.error(ctx.action.name, e.message)
    return Promise.reject(e)
  }
}

module.exports = handler
