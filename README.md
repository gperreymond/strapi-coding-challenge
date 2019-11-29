# Strapi Coding Challenge

Le projet est "configuration driven", tout part de la définition des services et des actions, aussi appelés "microservices".

![moleculer services](moleculer.png?raw=true)

- https://moleculer.services/
- https://hapi.dev/

### Architecture globale

L'architecture de type "hexagonale", ou port/adapter, se base sur :

__Moleculer__, brique de base, qui est un framework orienté microservices, avec du service discovery, du load balancing applicatif, voir même du circuit breaker, des métriques automatiques, etc.

- https://moleculer.services/docs/0.13/

__HapiJS__, pour le gateway, son orientation configuration driven et son orientation API en font un atout de choc sur ce type de projet.

__Apollo Server__, vient finir la dernière brique de cette architecture.

Dans le projet, le serveur __graphql__ et __moleculer__ sont ensemble ; Il est bien entendu préconisé d'avoir les services __moleculer__ dans une infrastructure scalable d'un coté et le serveur __graphql__ d'un autre.

### Bootstrap applicatif

Installation des dépendances :

```sh
yarn
```

### Bootstrap ops / infra

Le dossier infrastructure contient un Bootstrap prod ready ; En développement on utilisera docker swarm comme orchestrateur.

En premier lieu, assurez vous d'avoir docker swarm de disponible en mode __master__

```sh
docker swarm init
```

Une fois cela vérifié, lancez la stack en local en effectuant :

```sh
./boostrap --start
```

Il faut attendre que tout soit bien démarré, puis quand cela est fait, passez à la migration des data :

```sh
yarn knex:all
```

### Jouer les tests

Le résultat du coverage sera dans le dossier __coverage__

```sh
yarn test
```

### Lancer en local

Il est temps de lancer le projet :

```sh
yarn start
```

A ce stade, deux servers http sont disponibles :

- __graphql__: http://localhost:3000/graphql
- __hapijs__ : http://localhost:7000/documentation

Comme vous le voyez, une auto-documentation est générée par la configuration, voir __swagger__ pour plus d'information.
