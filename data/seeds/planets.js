const data = require('../../challenge/planets.json')

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('planets').del()
    .then(function () {
      // Inserts seed entries
      return knex('planets').insert(data)
    })
}
