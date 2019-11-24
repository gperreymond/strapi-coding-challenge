module.exports = `
  """
  This type describes a planet entity.
  """
  type Planet @cacheControl(maxAge: 240) {
    id: ID!
    name: String!
    code: String!
    spaceCenters(limit: Int!): [SpaceCenter]
  }
  """
  This type describes a space center entity.
  """
  type SpaceCenter @cacheControl(maxAge: 240) {
    id: ID!
    uid: String!
    name: String!
    description: String!
    latitude: Float!
    longitude: Float!
    planet: Planet
  }
  """
  This type describes a flight entity.
  """
  type Flight {
    id: ID!
    uid: String!
    name: String!
    description: String!
  }
`