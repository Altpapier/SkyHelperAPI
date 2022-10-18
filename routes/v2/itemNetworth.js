const { wrap } = require('../../utils/request');
const { getPrices } = require('../../data/refreshPrices');
const { getItemNetworth } = require('skyhelper-networth');

module.exports = wrap(async function (req, res) {
    const data = req.body;
    if (!data) res.status(400).json({ status: 400, reason: 'Missing request body' });

    const networth = await getItemNetworth(data, { prices: getPrices() });

    return res.status(200).json({ status: 200, data: networth });
});
