#!/bin/bash

export NODE_ENV=test
export APP_MOLECULER_LOGGER=false
export APP_GATEWAY_PORT=7070
export APP_APOLLO_PORT=3030

yarn knex:all
yarn standard
yarn test:coverage
