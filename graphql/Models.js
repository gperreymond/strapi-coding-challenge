module.exports = `
  """
  This type describes a planet entity.
  """
  type Planet {
    id: Int!
    name: String!
    code: String!
    spaceCenters: [SpaceCenter]
  }
  """
  This type describes a space center entity.
  """
  type SpaceCenter {
    id: Int!
    uid: String!
    name: String!
    description: String!
  }
  """
  This type describes a flight entity.
  """
  type Flight {
    id: Int!
    uid: String!
    name: String!
    description: String!
  }
`
