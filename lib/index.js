'use strict'

const Boom = require('boom')
const Joi = require('joi')

/**
 * Express wrapper-ware for a route
 * @param {object} route - The route to validate
 * @param {object} route.validate - The Joi's schema for the request
 * @param {object} route.response - The Joi's schema for the response
 * @param {object} options - Joi's options
 */
module.exports = (route, options) => {
  // This function will be the actual route
  return (req, res, next) => {
    if (route.response) {
      // Monkey patch the 'send'
      let originalSend = res.send

      res.send = function (body) {
        route.response.status = route.response.status || {}

        let schema = route.response.status[this.statusCode] || route.response.schema

        function responseValidationDone (err) {
          if (err) {
            return next(Boom.badImplementation(err.message, err.details))
          }

          // Restoring it
          res.send = originalSend

          return res.send(body)
        }

        if (schema) {
          Joi.validate(body || {}, schema, options, responseValidationDone)
        } else {
          responseValidationDone()
        }
      }.bind(res)
    }

    function requestValidationDone (err, request) {
      request = request || {}
      if (err) {
        return next(Boom.badRequest(err.message, err.details))
      }

      // Copy the validated data to the req object
      Object.assign(req, request)

      return route.handler(req, res)
    }

    if (route.validate) {
      let request = ['params', 'body', 'query']
        .filter((type) => route.validate[type] && req[type])
        .reduce((acc, type) => {
          acc[type] = req[type]
          return acc
        }, {})

      return Joi.validate(request, route.validate, options, requestValidationDone)
    }

    return requestValidationDone()
  }
}
