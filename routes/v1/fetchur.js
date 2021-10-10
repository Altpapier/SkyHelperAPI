const items = require('../../constants/fetchur_items')

module.exports = (req, res) => {
    let today = new Date();
    today.setHours(today.getHours() - 6);
    let day = today.getDate();
    let item;
    if (day <= 12) {
        item = items[day]
    }
    item = items[(day % 12)]

    return res.status(200).json(item)
}