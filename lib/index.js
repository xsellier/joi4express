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
module.exports = (route, options, formatter) => {
  // This function will be the actual route
  return (req, res, next) => {
    /**
     * Optional - Users can make basic changes to the error message.
     * The eval() command is run against the formatter string in the following way:
     * message = eval(`err.message.${formatter}`)
     * details[].message = eval(`details[].message.${formatter}`)
     *
     * This is useful if you want to eliminiate the double quotes
     * returned by Joi (ex: formatter = 'replace(/"/g, "")')
     * @param  {Error} err A Joi validation Error
     * @return {Object}     An object of the form:
     * {
     *    message: 'a message',
     *    details: [{
     *      // joi validation error details
     *    }]
     * }
     */
    function formatError (err) {
      let message = err.message || ''
      let details = err.details || []

      if (formatter) {
        try {
          const msgCmd = `err.message.${formatter}`
          const detailsCmd = `detail.message.${formatter}`

          message = eval(msgCmd)
          details = err.details.map(detail => ({
            ...detail,
            message: eval(detailsCmd)
          }))
        } catch (e) {
          console.error('Joi4Express - An error occured when formatting Joi error')
        }
      }

      return {
        message,
        details
      }
    }

    if (route.response) {
      // Monkey patch the 'send'
      let originalSend = res.send

      res.send = function (body) {
        route.response.status = route.response.status || {}

        let schema = route.response.status[this.statusCode] || route.response.schema

        /**
         * Called after a response validation. If an error occured,
         * it is processed (formatted if necessary) and returned
         * @param  {Error} err
         * @return      Returns the response body if successful,
         *                else, calls the next() callback with a Boom Error
         */
        function responseValidationDone (err) {
          if (err) {
            const { message, details } = formatError(err)

            return next(Boom.badImplementation(message, details))
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

    /**
     * Called after a request validation. If an error occured,
     * it is processed (formatted if necessary) and returned
     * @param  {Error} err
     * @return      Calls the route handler if successful,
     *                else, calls the next() callback with a Boom Error
     */
    function requestValidationDone (err, request) {
      request = request || {}
      if (err) {
        const { message, details } = formatError(err)

        return next(Boom.badRequest(message, details))
      }

      // Copy the validated data to the req object
      Object.assign(req, request)

      return route.handler(req, res)
    }

    if (route.validate) {
      let request = ['headers', 'params', 'body', 'query']
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
