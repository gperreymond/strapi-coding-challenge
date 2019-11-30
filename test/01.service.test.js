const Service = require('../modules/Service')

describe('[Unit] The module Service', () => {
  test('should be declared even if nothing configure', async () => {
    const service = new Service('UnitTests02')
    expect(service.getInstance().name).toEqual('UnitTests02')
  })
  test('should be declared', async () => {
    const service = new Service('UnitTests01')
    expect(service.getInstance().name).toEqual('UnitTests01')
  })
})
