# joi4express [![Build Status](https://travis-ci.org/xsellier/joi4express.svg?branch=master)](https://travis-ci.org/xsellier/joi4express)

Joiexpress validator

## Usage

```js
const express = require('express')
const app = express()
const joi4express = require('joi4express')
const helloWorld = {
  handler: (req, res) => {
    res.send('Hello-world !')
  },
  validate: {
    query: Joi.object({
      param1: Joi.string()
    }),
    params: Joi.object({
      param1: Joi.string()
    }),
    body: {
      param1: Joi.array().items({
        param2: Joi.string()
      })
    },
    headers: Joi.object({
      param1: Joi.string()
    }),
  },
  response: {
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
}

app.get('/', joi4express(helloWorld))

app.listen(port, function () {
  console.log(`Example app listening on port ${port} !`)
})
```

## Installation

### Installing joi4express
```
  npm install joi4express --save
```

## Run Tests
Tests are written with mocha/chai.

``` bash
  $ npm test
```
