'use strict'

/**
 * Make an iterator for middleware.
 *
 * @return {Object}
 * @api public
 */

const iterator = {
  [Symbol.iterator] (middleware, context, nextFunc) {
    const length = middleware.length
    let i = -1

    return {

      next () {
        let fn = middleware[++i] || nextFunc
        let done = i === length
        let value
        let nextCalled = false

        if (fn) {
          value = fn(context, () => {
            if (nextCalled) {
              throw new Error('next() called multiple times')
            }
            nextCalled = true
            return Promise.resolve().then(() => this.next().value)
          })
        }

        return {
          value,
          done
        }
      }
    }
  }
}

/**
 * Expose iterator.
 */

module.exports = iterator
