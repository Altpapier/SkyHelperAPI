module.exports = class HttpException extends Error {
    constructor(statusCode, message) {
      super()
  
      this.statusCode = statusCode
      this.message = message
    }
  }
  