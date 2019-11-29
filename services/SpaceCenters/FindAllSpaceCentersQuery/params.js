const params = {
  skip: { type: 'number', integer: true, min: 0 },
  limit: { type: 'number', integer: true, min: 1, max: 100 }
}

module.exports = params
