const fs = require('fs');
const axios = require('axios')

setTimeout(async () => {
    const response = (await axios.get('https://api.altpapier.dev/v1/fetchur?key=altpapier_test')).data
    fs.writeFileSync("./examples/fetchur/example_response_full.json", JSON.stringify(response, null, 2));
})

