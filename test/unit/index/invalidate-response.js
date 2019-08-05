'use strict'

const Joi = require('joi')
const chai = require('chai')
const dirtyChai = require('dirty-chai')

chai.use(dirtyChai)
const expect = chai.expect

const joi4express = require('../../../lib')

describe('#index', () => {
  const joiOptions = {
    presence: 'required'
  }
  const responseSchema = {
    schema: Joi.object({
      param1: Joi.string()
    }),
    status: {
      204: Joi.object({
        param2: Joi.string()
      }),
      404: Joi.object({
        error: Joi.string().allow('Failure')
      })
    }
  }
  const response = {
    status: (code) => {
      response.statusCode = code

      return response
    },
    send: (body) => {
      throw new Error('This should not be called')
    }
  }
  const messageFormatter = 'replace(/"/g, "")'

  it('should invalidate a response (with 2xx expected status code)', (done) => {
    const expectedStatusCode = 204
    const route = {
      handler: (req, res) => {
        res.status(expectedStatusCode).send()
      },
      response: responseSchema
    }

    joi4express(route, joiOptions)({}, response, (err) => {
      expect(err).to.exist()

      done()
    })
  })

  it('should invalidate a response (with 2xx expected status code) and should format the error messages', (done) => {
    const expectedStatusCode = 204
    const route = {
      handler: (req, res) => {
        res.status(expectedStatusCode).send()
      },
      response: responseSchema
    }

    joi4express(route, joiOptions, messageFormatter)({}, response, (err) => {
      expect(err).to.exist()
      expect(err.message).to.not.contain('"')

      done()
    })
  })

  it('should invalidate a response (with 2xx expected status code) and should handle an invalid formatter string', (done) => {
    const invalidMsgFormatter = '.01928398ad@#!'
    const expectedStatusCode = 204
    const route = {
      handler: (req, res) => {
        res.status(expectedStatusCode).send()
      },
      response: responseSchema
    }

    joi4express(route, joiOptions, invalidMsgFormatter)({}, response, (err) => {
      expect(err).to.exist()
      expect(err.message).to.contain('"')

      done()
    })
  })

  it('should invalidate a response (with 4xx expected status code)', (done) => {
    const expectedStatusCode = 404

    const route = {
      handler: (req, res) => {
        res.status(expectedStatusCode).send({})
      },
      response: responseSchema
    }

    joi4express(route, joiOptions)({}, response, (err) => {
      expect(err).to.exist()

      done()
    })
  })

  it('should invalidate a response (with 500 unexpected status code)', (done) => {
    const expectedStatusCode = 500

    const route = {
      handler: (req, res) => {
        res.status(expectedStatusCode).send({})
      },
      response: responseSchema
    }

    joi4express(route, joiOptions)({}, response, (err) => {
      expect(err).to.exist()

      done()
    })
  })
})
