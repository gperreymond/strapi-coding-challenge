module.exports = `
  type Query {
    planets: [Planet]
    spaceCenters(page: Int, pageSize: Int): SpaceCentersResult
    spaceCenter(uid: ID!): SpaceCenter
  }
`
