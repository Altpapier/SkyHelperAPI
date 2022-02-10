const itemGenerator = require('../constants/maro_networth/generators/itemGenerator');
const networthGenerator = require('../constants/maro_networth/generators/networthGenerator');
const db = require('../constants/maro_networth/storage/database');

let prices = {};

const retrievePrices = async function () {
    for (const item of await db.auctions.find()) {
        if (!(item?.auction?.name || '').toLowerCase().includes('null')) prices[item.id.toLowerCase()] = parseInt(item.auction.price);
    }

    for (const product of await db.bazaar.find()) {
        prices[product.id.toLowerCase()] = parseInt(product.buyPrice);
    }
    console.log('Prices retrieved successfully');
};

retrievePrices();
setInterval(() => retrievePrices(), 60 * 10000);

module.exports = async (profile, profileData) => {
    const bank = profileData?.banking?.balance || 0;
    const items = await itemGenerator.getItems(profile, prices);
    if (items.no_inventory) return { no_inventory: true };

    const networth = await networthGenerator.getNetworth(items, profile, bank);
    if (Object.keys(networth.categories).length < 0) return { no_inventory: true };

    return {
        total_networth: networth.networth,
        purse: networth.purse,
        bank: networth.bank,
        types: networth.categories,
    };
};
