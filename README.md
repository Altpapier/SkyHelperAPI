# SkyHelper API

A hypixel skyblock API wrapper containing most features that the [SkyHelper](https://top.gg/bot/710143953533403226) bot has to offer.

This API was made using the [Hypixel Skyblock Facade](https://github.com/Senither/hypixel-skyblock-facade), [SkyCrypt](https://github.com/SkyCryptWebsite/SkyCrypt) and [Maro API](https://github.com/zt3h/MaroAPI).

# Installing

### Requirements:

Node.js >= 14

### Setup:

1. Clone the repository using
   `git clone https://github.com/Altpapier/SkyHelperAPI.git`

2. Install all dependencies using NPM by going into the `SkyHelperAPI` folder
   `npm install`

3. Set up the [environment variables](#Environment-Variables)

4. Start the API using `node .` or `npm start`

### Environment Variables

The Port normally defaults to `3000`. If you want to change that, you can do so by changing the `PORT` environment variable.

You will have to set the Hypixel API key by adding the `HYPIXEL_API_KEY` environment variable.

To be able to use the API you will need to define your own API keys. For that add the `TOKENS` environment variable and add tokens seperated by a `,`
Example: `token1,token2`

The API automatically updates upon starting. If you wish to not want that, change the `AUTO_UPDATE` environment variable to `false`

# Endpoints:

### `GET` /v1/profiles/:user

### `GET` /v1/profile/:user/:profile

### `GET` /v1/items/:user

### `GET` /v1/items/:user/:profile

### `GET` /v1/bingo/:user

### `GET` /v1/fetchur

| Parameter | Description                                |
| --------- | ------------------------------------------ |
| user      | This can be the UUID of a user or the name |
| profile   | This can be the users profile id or name   |

# Features:

| Feature        | Description                                                             | Endpoint               |
| -------------- | ----------------------------------------------------------------------- | ---------------------- |
| skills         | Get a player's skills                                                   | profile/profiles       |
| networth       | Get a player's networth including all information about the calculation | profile/profiles       |
| weight         | Get a player's Senither and Lily weight                                 | profile/profiles       |
| dungeons       | Get a player's dungeons stats                                           | profile/profiles       |
| bestiary       | Get a player's bestiary                                                 | profile/profiles       |
| crimson        | Get player's Crimson Isle data                                          | profile/profiles       |
| trophy_fish    | Get player's trophy fishing caches and information                      | profile/profiles       |
| enchanting     | Get a player's enchanting stats including experimentations              | profile/profiles       |
| farming        | Get a player's farming stats including Jacob's contests                 | profile/profiles       |
| mining         | Get a player's mining stats including HotM tree and forge               | profile/profiles       |
| slayer         | Get a player's slayer stats                                             | profile/profiles       |
| milestones     | Get a player's pet milestones (rock / dolphin)                          | profile/profiles       |
| missing        | Get a player's missing talismans including their price                  | profile/profiles       |
| kills          | Get a player's most killed mobs                                         | profile/profiles       |
| deaths         | Get a player's deaths                                                   | profile/profiles       |
| armor          | Get a player's armor                                                    | profile/profiles/items |
| equipment      | Get a player's equipment                                                | profile/profiles/items |
| pets           | Get a player's pets                                                     | profile/profiles       |
| talismans      | Get a player's talismans                                                | profile/profiles       |
| collections    | Get a player's collections                                              | profile/profiles       |
| minions        | Get a player's minions                                                  | profile/profiles       |
| cakebag        | Get a player's new year cake editions                                   | profile/profiles       |
| backpack       | Get player's backpacks                                                  | items                  |
| quiver         | Get player's quiver                                                     | items                  |
| talisman bag   | Get player's talisman bag                                               | items                  |
| backpack icons | Get data about player's backpacks                                       | items                  |
| ender chest    | Get player's ender chest                                                | items                  |
| potion bag     | Get player's potion bag                                                 | items                  |
| fishing bag    | Get player's fishing bag                                                | items                  |
| personal vault | Get player's personal vault                                             | items                  |
| inventory      | Get player's inventory                                                  | items                  |
| candy bag      | Get player's candy bag                                                  | items                  |
| items          | Check what item fetchur wants today                                     | fetchur                |
| bingo          | Get a player's bingo profile and progress                               | fetchur                |

**Documentation**: https://api.altpapier.dev

# Credit:

- https://github.com/zt3h/MaroAPI

- https://github.com/Senither/hypixel-skyblock-facade

- https://github.com/SkyCryptWebsite/SkyCrypt
