module.exports = {
    titleCase: function titleCase(str, replaceunderscore=false) {
        try {
            if (replaceunderscore) str = str.replace(/_/g, ' ')
            let splitStr = str.toLowerCase().split(" ");
            for (let i = 0; i < splitStr.length; i++) {
                splitStr[i] = splitStr[i][0].toUpperCase() + splitStr[i].substr(1);
            }
            str = splitStr.join(" ");
            return str;
        } catch (err) {
            return null
        }
    },
    capitalize: function capitalize(str) {
        if (!str) return null 
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    toFixed: function toFixed(num, fixed) {
        let re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
        return num.toString().match(re)[0];
    }
}