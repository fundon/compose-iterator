'use strict'

// Shorthand for Symbol.iterator
const SYMBOL_ITERATOR = Symbol.iterator

/**
 * Make an iterator for middleware.
 *
 * @return {Object}
 * @api public
 */

const iterator = {
  [SYMBOL_ITERATOR] (middleware, length, context, nextFunc) {
    return {
      next (i = 0) {
        const fn = middleware[i] || nextFunc
        let called = false

        return {
          done: i === length,
          value: fn && fn(context, () => {
            if (called) {
              throw new Error('next() called multiple times')
            }
            called = true
            return Promise.resolve(this.next(i + 1).value)
          })
        }
      }
    }
  }
}

/**
 * Expose iterator.
 */

module.exports = iterator
