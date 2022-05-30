const { wrap } = require('../../utils/request');
const { getAuctionHouse } = require('../../data/refreshAuctions');
const { auctionMatches } = require('../../utils/auctionMatches');

module.exports = wrap(async function (req, res) {
    const search = JSON.parse(req.params.data);
    const lBIN = await lowestBIN(search);
    
    if (lBIN) return res.status(200).json({ status: 200, data: lBIN });
    else return res.status(503).json({ status: 503, data: 'Auction House not loaded' });
});

async function lowestBIN(search) {
    const AuctionHouse = getAuctionHouse();
    if (!AuctionHouse) return false;
    let result = {
        price: undefined,
        auction: undefined,
        closest: {
            score: 0,
            price: undefined,
            auction: undefined,
        },
    };

    AuctionHouse.forEach((auction) => {
        const match = auctionMatches(search, auction);
        if (match === 1 && auction.bin && (!result.price || auction.starting_bid < result.price)) {
            result.price = auction.starting_bid;
            result.auction = auction;
        } else if (auction.bin && (match > result.closest.score || (match === result.closest.score && (!result.closest.price || auction.starting_bid < result.closest.price)))) {
            result.closest.score = match;
            result.closest.price = auction.starting_bid;
            result.closest.auction = auction;
        }
    });

    return result;
}
