const data = require('../../challenge/space-centers.json').slice(0, 20)

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('space_centers').del()
    .then(function () {
      // Inserts seed entries
      return knex('space_centers').insert(data)
    })
}
