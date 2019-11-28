module.exports = {
  Query: {
    planets: (_, __, context, ___) => {
      return context.$moleculer.call('Planets.FindAllPlanetsQuery')
    },
    spaceCenters: async (_, { page, pageSize }, context, ___) => {
      if (!page) { page = 1 }
      if (!pageSize) { pageSize = 10 }
      const { total } = await context.$moleculer.call('SpaceCenters.GetTotalOfSpaceCentersQuery')
      const nodes = await context.$moleculer.call('SpaceCenters.FindAllSpaceCentersQuery', { skip: (page - 1) * pageSize, limit: pageSize })
      return {
        pagination: {
          total,
          page,
          pageSize
        },
        nodes
      }
    }
  },
  Planet: {
    spaceCenters: ({ code: planetCode }, { limit }, context, _) => {
      return context.$moleculer.call('Planets.FindAllSpaceCentersByPlanetIdQuery', { planetCode, limit })
    }
  }
}
