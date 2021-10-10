const HttpException = require('../exceptions/httpexception')


module.exports = (error, _, response, __) => {
  if (error instanceof HttpException) {
    return response.status(error.statusCode).json({
      status: error.statusCode,
      reason: error.message,
    })
  } else if (error.hasOwnProperty('response')) {
    switch (error.response.status) {
      case 403:
        return createJsonResponse(response, 403, 'Invalid Hypixel API token provided')

      case 404:
        return createJsonResponse(response, 404, 'The requested resource does not exist')

      case 429:
        return createJsonResponse(response, 429, 'You have hit the rate-limit, please slow down your requests')

      case 502:
        return createJsonResponse(response, 502, 'Hypixels API is currently experiencing some technical issues, try again later')

      case 521:
        return createJsonResponse(response, 503, 'Hypixels API is currently in maintenance mode, try again later')
    }
  }

  const jsonResponse = {
    status: 500,
    reason: error.message,
  }

  //jsonResponse.stack = error.stack?.split('\n')


  return response.status(500).json(jsonResponse)
}

function createJsonResponse(response, statusCode, reason) {
  return response.status(statusCode).json({
    status: statusCode,
    reason: reason,
  })
}