#!/bin/bash

docker network create -d overlay --attachable global

if [ "$1" = '--start' ]; then
  docker stack deploy -c infrastructure/docker-compose.traefik.yml proxy
  docker stack deploy -c infrastructure/docker-compose.databases.yml databases
  docker stack deploy -c infrastructure/docker-compose.brokers.yml brokers
fi

if [ "$1" = '--stop' ]; then
  docker stack rm proxy
  docker stack rm databases
  docker stack rm brokers
fi
