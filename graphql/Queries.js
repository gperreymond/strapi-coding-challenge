module.exports = `
  type Query {
    planet(id: ID!): Planet
    planets: [Planet]
    spaceCenters: [SpaceCenter]
  }
`
