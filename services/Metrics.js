module.exports = {
  name: 'Metrics',
  events: {
    'metrics.trace.span.finish': {
      async handler (data) {
        this.logger.info('This is the metrics to log:', data)
        return true
      }
    }
  }
}
