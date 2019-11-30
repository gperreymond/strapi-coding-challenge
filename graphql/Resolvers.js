module.exports = {
  Query: {
    planets: (_, __, { $moleculer }, ___) => {
      return $moleculer.call('Planets.FindAllPlanetsQuery')
    },
    spaceCenter: async (_, { uid }, { $moleculer }, ___) => {
      return $moleculer.call('SpaceCenters.GetSpaceCenterByUIDQuery', { uid })
    },
    spaceCenters: async (_, { page, pageSize }, { $moleculer }, ___) => {
      if (!page) { page = 1 }
      if (!pageSize) { pageSize = 10 }
      const { total } = await $moleculer.call('SpaceCenters.GetTotalOfSpaceCentersQuery')
      const nodes = await $moleculer.call('SpaceCenters.FindAllSpaceCentersQuery', { skip: (page - 1) * pageSize, limit: pageSize })
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
  SpaceCenter: {
    planet: ({ planet_code: code }, __, { $moleculer }, _) => {
      return $moleculer.call('Planets.GetPlanetByCodeQuery', { code })
    }
  },
  Planet: {
    spaceCenters: ({ code: planetCode }, { limit }, { $moleculer }, _) => {
      return $moleculer.call('Planets.FindAllSpaceCentersByPlanetIdQuery', { planetCode, limit })
    }
  }
}
