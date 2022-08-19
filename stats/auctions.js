module.exports = async (auctionsData) => {
    const auctions = {
        active: [],
        ended: [],
    };

    for (const auction of auctionsData.auctions) {
        if (auction.end >= Date.now()) {
            if (auction.item_lore.includes('\n')) auction.item_lore = auction.item_lore.split('\n')
             auctions.active.push(auction)
        }
        else {
            if (!auction.claimed) {
                if (auction.item_lore.includes('\n')) auction.item_lore = auction.item_lore.split('\n')
                auctions.ended.push(auction)
            }
        }
    }

    return {
        active: auctions.active,
        ended: auctions.ended
    };  
};
