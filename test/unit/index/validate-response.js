'use strict'

const Joi = require('joi')
const chai = require('chai')
const dirtyChai = require('dirty-chai')

chai.use(dirtyChai)
const expect = chai.expect

const joi4express = require('../../../lib')

describe('#index', () => {
  const responseSchema = {
    schema: Joi.object({
      param1: Joi.string()
    }),
    status: {
      204: Joi.object({
        param2: Joi.string()
      }),
      404: Joi.object({
        error: 'Failure'
      })
    }
  }

  it('should validate a response (with 2xx expected status code', function (done) {
    const expectedStatusCode = 204
    const expectedOutput = { param2: 'valid value' }
    const response = {
      status: (code) => {
        response.statusCode = code

        return response
      },
      send: (body) => {
        expect(response.statusCode).to.equal(expectedStatusCode)
        expect(body).to.equal(expectedOutput)

        done()
      }
    }
    const route = {
      handler: function (req, res) {
        res.status(expectedStatusCode).send(expectedOutput)
      },
      response: responseSchema
    }

    joi4express(route)({}, response, done)
  })

  it('should validate a response (with 4xx expected status code', function (done) {
    const expectedStatusCode = 404
    const expectedOutput = { error: 'Failure' }
    const response = {
      status: (code) => {
        response.statusCode = code

        return response
      },
      send: (body) => {
        expect(response.statusCode).to.equal(expectedStatusCode)
        expect(body).to.equal(expectedOutput)

        done()
      }
    }
    const route = {
      handler: function (req, res) {
        res.status(expectedStatusCode).send(expectedOutput)
      },
      response: responseSchema
    }

    joi4express(route)({}, response, done)
  })

  it('should validate a response (with 500 unexpected status code', function (done) {
    const expectedStatusCode = 500
    const expectedOutput = { param1: 'Valid value' }
    const response = {
      status: (code) => {
        response.statusCode = code

        return response
      },
      send: (body) => {
        expect(response.statusCode).to.equal(expectedStatusCode)
        expect(body).to.equal(expectedOutput)

        done()
      }
    }
    const route = {
      handler: function (req, res) {
        res.status(expectedStatusCode).send(expectedOutput)
      },
      response: responseSchema
    }

    joi4express(route)({}, response, done)
  })
})
