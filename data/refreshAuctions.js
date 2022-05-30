const axios = require('axios');
const fs = require('fs');

let AuctionHouse = [];

module.exports = {
    getAuctionHouse: () => AuctionHouse,
    refreshAuctions: async () => {
        async function updateAuctions() {
            let request;
            try {
                request = await axios.get('https://raw.githubusercontent.com/SkyHelperBot/Prices/main/auctionHouse.json');
            } catch (err) {
                return console.log('Failed to update Auction House: ', err);
            }

            if (request.status === 200) {
                AuctionHouse = request.data;
                fs.writeFileSync('./data/auctionHouse.json', JSON.stringify(request.data, null, 2));
                console.log(`[AUCTIONHOUSE] Auction House updated successfully with ${AuctionHouse.length} auctions`);
            } else {
                console.log('[AUCTIONHOUSE] Failed to update Auction House: ', request.status);
            }
        }

        updateAuctions();
        setInterval(async () => {
            updateAuctions();
        }, 1000 * 60 * 5); // 5 minutes
    }
}
