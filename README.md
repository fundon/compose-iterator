# Compose Iterator

Fastest iterator for middleware composition.

## Benchmarks

**For [koa-compose v3](https://github.com/koajs/compose/tree/3.1.0)**

### Before

```
                      compose
          43,981 op/s » (fn * 1)
          25,044 op/s » (fn * 2)
          13,359 op/s » (fn * 4)
           6,972 op/s » (fn * 8)
           3,555 op/s » (fn * 16)
           1,803 op/s » (fn * 32)
             920 op/s » (fn * 64)
             466 op/s » (fn * 128)
             231 op/s » (fn * 256)
             113 op/s » (fn * 512)
              55 op/s » (fn * 1024)
              27 op/s » (fn * 2048)
              13 op/s » (fn * 4096)
               6 op/s » (fn * 8192)
```

### After

```
                      compose
         206,669 op/s » (fn * 1)
         202,517 op/s » (fn * 2)
         209,224 op/s » (fn * 4)
         208,893 op/s » (fn * 8)
         205,962 op/s » (fn * 16)
         205,885 op/s » (fn * 32)
         205,316 op/s » (fn * 64)
         206,602 op/s » (fn * 128)
         205,352 op/s » (fn * 256)
         201,229 op/s » (fn * 512)
         188,328 op/s » (fn * 1024)
         167,314 op/s » (fn * 2048)
         182,743 op/s » (fn * 4096)
         174,105 op/s » (fn * 8192)
```

## Installation

```
$ npm install compose-iterator
```

## Examples

### **[compose.js](examples/compose.js)**

```js
'use strict'

const Promise = require('any-promise')

const iterator = require('compose-iterator')

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
   * Make an iterator for middleware.
   */

  middleware[Symbol.iterator] = iterator

  // Alternative iteration.
  const iter = middleware[Symbol.iterator]()

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context, next) {
    try {
      return Promise.resolve(iter.next(context, next).value)
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
![](https://img.shields.io/badge/status-stable-green.svg)

---

> [fundon.me](https://fundun.me) &nbsp;&middot;&nbsp;
> GitHub [@fundon](https://github.com/fundon) &nbsp;&middot;&nbsp;
> Twitter [@_fundon](https://twitter.com/_fundon)

