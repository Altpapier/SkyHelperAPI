const axios = require('axios');
const headers = ['RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset']

module.exports = {
  makeRequest: async function makeRequest(response, url) {
    const result = await axios.get(url)

    for (let header of headers) {
      if (result.headers.hasOwnProperty(header.toLowerCase())) {
        response.set(header, result.headers[header.toLowerCase()])
      }
    }

    return result
  }
}