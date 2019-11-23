const data = require('../../challenge/space-centers.json')

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('space_centers').del()
    .then(function () {
      // Inserts seed entries
      return knex('space_centers').insert(data)
    })
}
