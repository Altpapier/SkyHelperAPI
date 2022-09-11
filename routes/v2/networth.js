const { wrap } = require('../../utils/request');
const { getNetworth, getPrices } = require('skyhelper-networth');

let prices = {};
getPrices().then((data) => {
    prices = data;
});
setInterval(async () => {
    prices = await getPrices();
}, 1000 * 60 * 5); // 5 minutes

module.exports = wrap(async function (req, res) {
    // data: { profileData: object, bankBalance: number, onlyNetworth: boolean (default: false) }
    const data = req.body;
    if (!data) res.status(400).json({ status: 400, reason: 'Missing request body' });
    if (!data?.profileData) res.status(400).json({ status: 400, reason: 'Missing "profileData" in request body' });

    const networth = await getNetworth(data.profileData, data.bankBalance, { prices, onlyNetworth: data.onlyNetworth });

    return res.status(200).json({ status: 200, data: networth });
});
