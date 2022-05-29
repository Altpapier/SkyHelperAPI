const { decodeData } = require('../utils/nbt')
const { capitalize } = require('../constants/functions')
const { talismans: allTalismans } = require('../constants/talismans')

module.exports = async (profile) => {
    if (profile.talisman_bag?.data) {
        const talismans = {
            common: [],
            uncommon: [],
            rare: [],
            epic: [],
            legendary: [],
            mythic: []
        }
        const talisman_bag = (await decodeData(Buffer.from(profile.talisman_bag.data, 'base64'))).i

        for (const talisman of talisman_bag) {
            if (talisman.tag?.display.Name && talisman.tag?.ExtraAttributes) {
                //If there is a reforge, remove the reforge from the item name
                let name = talisman.tag?.display.Name.replace(/\u00A7[0-9A-FK-OR]/ig, '') || null
                const reforge = capitalize(talisman.tag?.ExtraAttributes.modifier || null)
                if (reforge) name = name.substring(name.indexOf(' ') + 1)
                const isRecombed = talisman.tag?.ExtraAttributes.rarity_upgrades > 0 ? true : false || false

                const new_talisman = {
                    name: allTalismans[talisman.tag?.ExtraAttributes.id]?.name || name,
                    id: talisman.tag?.ExtraAttributes.id || null,
                    reforge: reforge,
                    rarity: getRarity(talisman.tag?.display.Lore).toUpperCase(),
                    recombobulated: isRecombed
                }
                if (talismans[getRarity(talisman.tag?.display.Lore)]) talismans[getRarity(talisman.tag?.display.Lore)].push(new_talisman)
                else talismans[getRarity(talisman.tag?.display.Lore)] = new_talisman
            }
        }

        return talismans
    } else {
        return {
            common: [],
            uncommon: [],
            rare: [],
            epic: [],
            legendary: [],
            mythic: []
        }
    }
}

function getRarity(lore) {
    let last_index = lore[lore.length -1]
    last_index = last_index.replace(/\u00A7[0-9A-FK-OR]/ig, '').toLowerCase()
    if (last_index.startsWith('a ')) last_index = last_index.substring(2)
    last_index = last_index.substring(0, last_index.indexOf(' '))
    return last_index
}