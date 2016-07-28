# Compose Iterator

Use iterator for middleware composition.

## Installation

```
$ npm install compose-iterator
```

## Examples

### **[compose.js](examples/compose.js)**

```js
'use strict'

const Promise = require('any-promise')

const iterator = require('..')

/**
 * Expose compositor.
 */

module.exports = compose

/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */

function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context, next) {
    // iteration object
    const iter = iterator[Symbol.iterator](middleware, context, next)

    try {
      return Promise.resolve(iter.next().value)
    } catch (err) {
      return Promise.reject(err)
    }
  }
}
```

### **[app.js](examples/app.js)**

```js
const co = require('co')
const compose = require('./compose')

function wait (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms || 1))
}

var arr = []
var stack = []

stack.push(function * (context, next) {
  arr.push(1)
  yield wait(1)
  yield next()
  yield wait(1)
  arr.push(6)
})

stack.push(function * (context, next) {
  arr.push(2)
  yield wait(1)
  yield next()
  yield wait(1)
  arr.push(5)
})

stack.push(function * (context, next) {
  arr.push(3)
  yield wait(1)
  yield next()
  yield wait(1)
  arr.push(4)
})

compose(stack.map((fn) => co.wrap(fn)))({}).then(function () {
  console.log(arr.toString() === [1, 2, 3, 4, 5, 6].toString())
})
```

## Badges

![](https://img.shields.io/badge/license-MIT-blue.svg)
[![Build Status](https://travis-ci.org/fundon/compose-iterator.svg?branch=master)](https://travis-ci.org/fundon/compose-iterator)

---

> [fundon.me](https://fundun.me) &nbsp;&middot;&nbsp;
> GitHub [@fundon](https://github.com/fundon) &nbsp;&middot;&nbsp;
> Twitter [@_fundon](https://twitter.com/_fundon)

