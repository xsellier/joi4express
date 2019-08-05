'use strict'

const Joi = require('joi')
const chai = require('chai')
const dirtyChai = require('dirty-chai')

chai.use(dirtyChai)
const expect = chai.expect

const joi4express = require('../../../lib')

describe('#index', () => {
  const route = {
    handler: (req, res) => {
      throw new Error('This should not be called')
    },
    validate: {
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
  }

  it('should validate a request (missing param)', (done) => {
    const request = {
      params: {
      },
      query: {
        param1: 'valid value'
      },
      body: {}
    }

    joi4express(route)(request, {}, (err) => {
      expect(err).to.exist()

      done()
    })
  })

  it('should validate a request (missing query)', (done) => {
    const request = {
      params: {
        param1: 'valid value'
      },
      query: {
      },
      body: {}
    }

    joi4express(route)(request, {}, (err) => {
      expect(err).to.exist()

      done()
    })
  })

  it('should validate a request (missing headers)', (done) => {
    const request = {
      params: {
        param1: 'valid value'
      },
      query: {
        param1: 'valid value'
      },
      body: {},
      headers: {}
    }

    joi4express(route)(request, {}, (err) => {
      expect(err).to.exist()

      done()
    })
  })
})
