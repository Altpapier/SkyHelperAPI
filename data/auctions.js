const { client: Redis } = require('../utils/redis');

let auctions = [];
const retrieveAuctions = async () => {
    const AuctionHouse = await Redis.get('AuctionHouse');
    auctions = JSON.parse(AuctionHouse);
    console.log('[AUCTIONHOUSE] Retrieved auctions');
};

module.exports = {
    getAuctionHouse: () => auctions,
    start: () => {
        console.info('[AUCTIONHOUSE] Auction house loaded');

        retrieveAuctions();
        setInterval(() => {
            retrieveAuctions();
        }, 1000 * 60 * 5);
    },
};
