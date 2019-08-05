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
    },
    headers: Joi.object({
      param1: Joi.string().required()
    })
  }

  const request = {
    params: {
      param1: 'valid value'
    },
    query: {
      param1: 'valid value'
    },
    body: {},
    headers: {
      param1: 'valid value'
    }
  }

  it('should validate a request', (done) => {
    const route = {
      handler: (req, res) => {
        expect(req).to.deep.equal(request)

        done()
      },
      validate: requestSchema
    }

    joi4express(route)(request, {}, done)
  })
})
