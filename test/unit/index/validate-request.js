'use strict'

const Joi = require('joi')
const chai = require('chai')
const expect = chai.expect

const joi4express = require('../../../lib')

describe('#index', () => {
  const requestSchema = {
    query: Joi.object({
      param1: Joi.string().required()
    }),
    params: Joi.object({
      param1: Joi.string().required()
    }),
    body: {
      param1: Joi.array().items({
        param2: Joi.string()
      })
    }
  }

  const request = {
    params: {
      param1: 'valid value'
    },
    query: {
      param1: 'valid value'
    },
    body: {}
  }

  it('should validate a request', function (done) {
    const route = {
      handler: function (req, res) {
        expect(req).to.deep.equal(request)

        done()
      },
      validate: requestSchema
    }

    joi4express(route)(request, {}, done)
  })
})
