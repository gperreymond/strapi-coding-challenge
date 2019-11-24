module.exports = {
  Query: {
    planets: (_, __, context, ___) => {
      return context.$moleculer.call('Planets.FindAllPlanetsQuery')
    },
    spaceCenters: (_, __, context, ___) => {
      return context.$moleculer.call('SpaceCenters.FindAllSpaceCentersQuery')
    }
  },
  Planet: {
    spaceCenters: ({ code: planetCode }, { limit }, context, _) => {
      return context.$moleculer.call('Planets.FindAllSpaceCentersByPlanetIdQuery', { planetCode, limit })
    }
  }
}
