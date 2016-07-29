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
  [SYMBOL_ITERATOR] (middleware, context, nextFunc) {
    const length = middleware.length
    let i = -1

    return {
      next () {
        const fn = middleware[++i] || nextFunc
        let nextCalled = false

        return {
          value: fn && fn(context, () => {
            if (nextCalled) {
              throw new Error('next() called multiple times')
            }
            nextCalled = true
            return Promise.resolve().then(() => this.next().value)
          }),
          done: i === length
        }
      }
    }
  }
}

/**
 * Expose iterator.
 */

module.exports = iterator
