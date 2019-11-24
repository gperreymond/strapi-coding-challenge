module.exports = `
  type Query {
    planet(id: ID!): Planet
    planets: [Planet]
    spaceCenters(page: Int, pageSize: Int): SpaceCentersResult
  }
`
