exports.up = knex =>
  knex.schema.createTable('planets', tbl => {
    tbl.increments('id').primary()
    tbl.string('name', 128).notNullable()
    tbl.string('code', 10).notNullable()
  })

exports.down = knex => knex.schema.dropTableIfExists('planets')
