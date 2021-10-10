const { getPrice, getBazaarPrice } = require('../constants/networth/functions')
const fs = require('fs')
const getPet = require('../constants/pets')
const { decodeData } = require('../utils/nbt')
const { titleCase } = require('../constants/functions')

module.exports = async (profile, profileData) => {
    const prices = JSON.parse(fs.readFileSync('./uuids.json').toString())

    let networth = {
        total_networth: 0,
        purse: Number((profile.coin_purse || 0).toFixed()),
        bank: Number((profileData.banking?.balance || 0).toFixed()),
        types: {
            armor: await getNetworth('data', profile.inv_armor?.data, prices),
            wardrobe: await getNetworth('data', profile.wardrobe_contents?.data, prices),
            inventory: await getNetworth('data', profile.inv_contents?.data, prices),
            enderchest: await getNetworth('data', profile.ender_chest_contents?.data, prices),
            storage: await getNetworth('storage', profile.backpack_contents, prices),
            pets: await getNetworth('pets', profile.pets, prices),
            accessories_bag: await getNetworth('data', profile.talisman_bag?.data, prices),
            sacks: await getNetworth('sacks', profile.sacks_counts, prices)
        }
    }
    for (const value of Object.values(networth.types)) {
        networth.total_networth += value.value
    }
    networth.total_networth += networth.purse
    networth.total_networth += networth.bank
    return networth
}

async function getNetworth(type, data, prices) {
    let networth = {
        value: 0,
        items: []
    }

    if (data) {
        if (type === 'sacks') {
            for (let i = 0; i < Object.keys(data).length; i++) {
                networth.value += getBazaarPrice(Object.keys(data)[i], prices) * Object.values(data)[i]
                if (getBazaarPrice(Object.keys(data)[i], prices) * Object.values(data)[i] > 0) {
                    networth.items.push({ type: titleCase(Object.keys(data)[i]), value: getBazaarPrice(Object.keys(data)[i], prices) * Object.values(data)[i], amount: Object.values(data)[i]})
                }
            }
        } else if (type === 'pets') {
            for (let pet of data) {
                networth.value += (getPrice(getPet(pet), prices, true)).value || 0
                networth.items.push(getPrice(getPet(pet), prices, true))
            }
            
        } else if (type === 'storage') {
            let storage_contents = []
            for (const backpack of Object.keys(data)) {
                const backpack_data = (await decodeData(Buffer.from(data[backpack].data, 'base64'))).i
                storage_contents = storage_contents.concat(backpack_data)
            }
            for (const item of storage_contents) {
                if (item?.tag) {
                    networth.value += (getPrice(item, prices, false)).value || 0
                    networth.items.push(getPrice(item, prices, false))
                }
            }
        } else if (type === 'data') {
            let contents = (await decodeData(Buffer.from(data, 'base64'))).i
            for (const item of contents) {
                if (item?.tag) {
                    networth.value += (getPrice(item, prices, false)).value || 0
                    networth.items.push(getPrice(item, prices, false))
                }
            }
        }
    }
    return networth
}