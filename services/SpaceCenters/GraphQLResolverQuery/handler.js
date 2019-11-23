const db = require('../../../data/db')

const handler = async function (ctx) {
  try {
    ctx.broker.logger.warn(ctx.action.name, ctx.params)
    const data = db('space_centers').map(async function (row) {
      const results = await db('planets').where('code', row.planet_code)
      row.planet = results[0]
      return row
    })
    return data
  } catch (e) {
    ctx.broker.logger.error(ctx.action.name, e.message)
    return Promise.reject(e)
  }
}

module.exports = handler
