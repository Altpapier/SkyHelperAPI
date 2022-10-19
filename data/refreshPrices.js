const { getPrices } = require('skyhelper-networth');

let prices = {};
getPrices().then((data) => {
    prices = data;
});

module.exports = {
    refreshPrices: () => {
        setInterval(async () => {
            prices = await getPrices();
        }, 1000 * 60 * 5); // 5 minutes
    },
    getPrices: () => prices,
};
