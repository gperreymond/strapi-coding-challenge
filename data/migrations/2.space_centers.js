exports.up = knex =>
  knex.schema.createTable('space_centers', tbl => {
    tbl.increments('id').primary()
    tbl.string('uid', 128).notNullable()
    tbl.string('name', 128).notNullable()
    tbl.text('description').notNullable()
    tbl.float('latitude').notNullable()
    tbl.float('longitude').notNullable()
    tbl.string('planet_code', 10).notNullable()
  })

exports.down = knex => knex.schema.dropTableIfExists('space_centers')
