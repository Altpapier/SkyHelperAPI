//CREDIT: https://github.com/Senither/hypixel-skyblock-facade (Modified)
const { makeRequest, wrap } = require('../../utils/request');

module.exports = wrap(async function (req, res) {
    const auctionsRes = (await makeRequest(res, `https://api.hypixel.net/skyblock/auctions`)).data.auctions;
    const queries = req.originalUrl.split('?')[1].split('&');
    const filteredAuctions = [];
    const searchData = {};

    for (let query of queries) {
        if (query.startsWith('key=')) continue;
        if (query.startsWith('name=')) query = query.replaceAll('%20', ' ');
        if (query.startsWith('lore=')) query = query.replaceAll('%20', ' ');
        searchData[query.split('=')[0]] = query.split('=')[1]
    }

    for (const auction of auctionsRes) {
        if (searchData.name) if (!auction.item_name.toLowerCase().includes(searchData.name.toLowerCase())) continue;
        if (searchData.lore) if (!auction.item_lore.toLowerCase().includes(searchData.lore.toLowerCase())) continue;
        if (searchData.rarity) if (!auction.tier.toLowerCase().includes(searchData.rarity.toLowerCase())) continue;
        if (searchData.tier) if (!auction.tier.toLowerCase().includes(searchData.tier.toLowerCase())) continue;
        if (searchData.category) if (!auction.category.toLowerCase().includes(searchData.category.toLowerCase())) continue;
        if (searchData.bin) if (auction.bin.toString() != searchData.bin) continue;
        if (auction.bin) {
            if (searchData.lowest_price) if (!(parseInt(searchData.lowest_price) <= auction.starting_bid)) continue;
            if (searchData.highest_price) if (!(parseInt(searchData.highest_price) >= auction.starting_bid)) continue;
        } else {
            if (searchData.lowest_price) if (!(parseInt(searchData.lowest_price) <= auction.highest_bid_amount != 0 ?? !(parseInt(searchData.lowest_price) <= auction.starting_bid))) continue;
            if (searchData.highest_price) if (!(parseInt(searchData.highest_price) >= auction.highest_bid_amount != 0 ?? !(parseInt(searchData.lowest_price) <= auction.starting_bid))) continue;
        }

        filteredAuctions.push(auction)
    }

    
    return res.status(200).json({ 
        status: 200, 
        found: filteredAuctions.length > 1,
        amount: filteredAuctions.length,
        filter: searchData,
        auctions: filteredAuctions
    });
});
