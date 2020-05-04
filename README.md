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

The library also accepts a Joi Options object, and a Custom Joi Error Formatting function.

In the following example, double quotes will be removed due to the custom error formatting function.

```js
const customJoiErrorFormatFcn = (e) => {
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
app.get('/', joi4express(helloWorld, joiOptions, customJoiErrorFormatFcn))
```

Any custom formatting function must return an object of the form:

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

If the user-defined formatting function fails, then the original message/details will be returned (as if the function was never defined in the first place)

The library also accepts some custom options in the form of `joi4expressOptions`, the optional 4th parameter to `joi4express`. These options include:
- **failOnResponseMisformat** (default `true`): If false, the response will be returned even if its format validation fail. However, the `invalidResponseLogger` function will still be invoked if provided.
- **invalidResponseLogger**: If provided, this function will be invoked with the formatted Joi error (including the formatting performed by a Custom Joi Error Formatting function) as well as the original Joi error.

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
