const axios = require("axios")
const { decodeData } = require('../utils/nbt')
const ignored_items = require('../constants/networth/ignored_items')
const vanilla_items = require('../constants/networth/vanilla_items')
const fs = require('fs')

module.exports = async function refreshPrices() {
    async function format_item_name(auction, { pet = false, tier = 'common', level = null, tierboosted } = {}) {
        let name = auction.item_name.toLowerCase();
        if (pet) {
            if (!level) {
                const match = (name.match(/\[lvl ?(?<level>[0-9]+)]/))
                if (match.groups.level <= 75) level = 1
                if (match.groups.level > 75) level = 2
                if (match.groups.level > 89) level = 3
                if (match.groups.level == 100) level = 4
                name = name.replace(/\[lvl ?([0-9]*)] ?/gi, `${level}:`);
                name = `${tier}:${name}${tierboosted ? ':t' : ''}`;
            } else name = `${tier}:${level}:${name}${tierboosted ? ':t' : ''}`
        } else {
            let item = (await decodeData(Buffer.from(auction.item_bytes, 'base64'))).i[0]
            if (item.tag?.ExtraAttributes.modifier) {
                name = name.substring(name.indexOf(' ') + 1)
            }
            if (name === 'enchanted book') {
                const enchants = item?.tag?.ExtraAttributes.enchantments
                if (enchants) {
                    if (Object.keys(enchants).length == 1) {
                        name = `${Object.keys(enchants)[0].replace(/_/g, ' ')} ${enchants[Object.keys(enchants)[0]]}`
                    }
                }
            }
            if (name === 'beastmaster crest' || name.includes('farming exp') || name.includes('mining exp') || name.includes('combat exp') || name.includes('foraging exp') || name.includes('fishing exp')) {
                name = `${auction.tier.toLowerCase()}:${name}`
            }
            if (item.tag?.ExtraAttributes.id.startsWith('PET_SKIN_') || item.tag?.ExtraAttributes.originTag === 'FIRE_SALE') name = item.tag.ExtraAttributes.id
        }
        name = name.replace(/✪/g, '').replace(/§[0-9a-k]/g, '').replace(/⚚/g, '').replace(/ ✦/g, '');
        return name.trim();
    }

    const [getPrices] = (function () {
        let prices = {};
        return [function () { return prices }, function (newPrices) { prices = Object.assign(prices, newPrices) }]
    })();

    async function updatePrices() {
        try {
            console.log('Getting prices')
            const auction_items = {}
            let auctions = (await axios.get('https://api.hypixel.net/skyblock/auctions?page=0')).data
            let allAuctions = auctions.auctions
            for (let page = 0; page < auctions.totalPages; page++) {
                auctions = (await axios.get(`https://api.hypixel.net/skyblock/auctions?page=${page}`)).data
                allAuctions = allAuctions.concat(auctions.auctions)
            }
            allAuctions = allAuctions.filter(x => x.bin)
            for (const auction of allAuctions) {
                let name = auction.item_name;
                let pet = !!(auction.item_name.match(/\[lvl ?[0-9]]*/gi))
                name = await format_item_name(auction)
                if (pet) {
                    name = await format_item_name(auction, { pet: true, tier: auction.tier.toLowerCase(), tierboosted: auction.item_lore.includes('Tier Boost') ? true : false })
                }
                Object.keys(auction_items).includes(name) ? auction_items[name].push(auction.starting_bid) : auction_items[name] = [auction.starting_bid];
            }
            let bazaar_data = (await axios.get('https://sky.lea.moe/api/v2/bazaar')).data
            const prices = Object.assign({}, getPrices())
            Object.keys(auction_items).forEach(item => {
                if (!(vanilla_items.includes(item.toLowerCase()) || ignored_items.includes(item.toLowerCase())))
                    prices[item] = Math.round(Math.min(...auction_items[item]))
            });
            Object.keys(bazaar_data).forEach(item => {
                prices[bazaar_data[item].id] = Math.round(bazaar_data[item].sellPrice)
            });
            console.log('Got all prices')
            fs.writeFileSync('./data/prices.json', JSON.stringify(prices, null, 2), (err) => { console.log(err) });
        } catch (err) {
            console.log(`Failed to get prices (${new Date()}`)
        }
    }

    await updatePrices()
    setInterval(async () => {
        await updatePrices()
    }, 600000) //10min
}