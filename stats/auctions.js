const { decodeData } = require('../utils/nbt');

module.exports = async (auctionsData) => {
    try {
    const auctions = {
        active: {
            bin: [],
            auction: [],
        },
        ended: {
            bin: [],
            auction: [],
        },
    };

    for (const auction of auctionsData.auctions) {
        if (auction.end >= Date.now()) {
            if (auction.item_lore.includes('\n')) auction.item_lore = auction.item_lore.split('\n')

            if (auction.bin) auctions.active.bin.push(auction)
            else auctions.active.auction.push(auction)
        }
        else {
            if (!auction.claimed) {
                if (auction.item_lore.includes('\n')) auction.item_lore = auction.item_lore.split('\n')

                if (auction.bin) auctions.ended.bin.push(auction)
                else auctions.ended.auction.push(auction)
            }
        }
        

    }
    /*
    for (let i = 0; i < response.auctions.length; i++) {
        if (response.auctions[i].end >= Date.now()) {
          const auctionInfromation = (await decodeData(Buffer.from(response.auctions[i].item_bytes.data, 'base64'))).i
          
          if (!response.auctions[i].bin) bidder = (await axios.get(`${config.api.hypixelAPI}/player?key=${config.api.hypixelAPIkey}&uuid=${response.auctions[i].bids[response.auctions[i].bids.length-1].bidder}`)).data.player
          let lore = response.auctions[i].item_lore.split('\n')
          lore.push('§8§m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯', `§7Seller: ${getRank(data)}${data.displayname}`)
          if (response.auctions[i].bin) lore.push(`§7Buy it now: §6${addCommas(response.auctions[i].starting_bid)} coins`)
          if (!response.auctions[i].bin) lore.push(`§7Bids: §a${(response.auctions[i].bids).length} bids`, ` `, `§7Top Bid: §6${addCommas(response.auctions[i].highest_bid_amount)} coins`, `§7Bidder: ${getRank(bidder)}${bidder.displayname}`)
          lore.push(' ', `§7Ends in: §e${timeSince(response.auctions[i].end)}`)
        }
      }*/
    return {
        active: auctions.active,
        ended: auctions.ended
    };

}catch(error){console.log(error)}
    
};
