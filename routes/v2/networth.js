const { wrap } = require('../../utils/request');
const { getPrices } = require('../../data/refreshPrices');
const { getNetworth } = require('skyhelper-networth');

module.exports = wrap(async function (req, res) {
    // data: { profileData: object, bankBalance: number, onlyNetworth: boolean (default: false) }
    const data = req.body;
    if (!data) res.status(400).json({ status: 400, reason: 'Missing request body' });
    if (!data?.profileData) res.status(400).json({ status: 400, reason: 'Missing "profileData" in request body' });

    const networth = await getNetworth(data.profileData, data.bankBalance, { prices: getPrices(), onlyNetworth: data.onlyNetworth });

    return res.status(200).json({ status: 200, data: networth });
});
