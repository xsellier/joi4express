# joi4express [![pipeline status](https://gitlab.com/xsellier/joi4express/badges/master/pipeline.svg)](https://gitlab.com/xsellier/joi4express/commits/master)

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

The library also accepts a Joi Options object.

### joi4express options
Additionally, the library has some joi4express specific options in the form of `joi4expressOptions`. These options include:

#### joiErrorFormatter
Provides a custom format to the Joi errors. Any custom formatting function must return an object of the form:

```js
{
  message: 'a message string',
  details: [
    {
      // Joi Error Details Object
    }
  ]
}
```

In the following example, double quotes will be removed due to the custom error formatting function.

```js
const joiErrorFormatter = (e) => {
  const message = e.message.replace(/"/g, '')
  const details = e.details.map(detail => ({
    ...detail,
    message: detail.message.replace(/"/g, '')
  }))

  return {
    message,
    details
  }
}

const joiOptions = null // Or some desired options
app.get('/', joi4express(helloWorld, joiOptions, { joiErrorFormatter }))
```

If the user-defined formatting function fails, then the original message/details will be returned (as if the function was never defined in the first place)

#### failOnResponseMisformat (default `true`)
If false, the response will be returned even if its format validation fails. However, the `invalidResponseLogger` function will still be invoked if provided.

#### invalidResponseLogger
If provided, this function will be invoked with the formatted Joi error (including the formatting performed by `joiErrorFormatter`) as well as the original Joi error.

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
