const handler = async function (ctx) {
  try {
    ctx.broker.logger.warn(ctx.action.name, ctx.params)
    return []
  } catch (e) {
    ctx.broker.logger.error(ctx.action.name, e.message)
    return Promise.reject(e)
  }
}

module.exports = handler
