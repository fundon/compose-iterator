'use strict'

/**
 * Expose iterator.
 */

module.exports = iterator

/**
 * Make an iterator for middleware.
 *
 * @return {Object}
 * @api public
 */

function iterator () {
  const self = this
  const length = this.length
  let i = 0
  let context
  let nextFunc

  return {
    next (c, n) {
      if (!context) context = c
      if (!nextFunc) nextFunc = n

      let fn = self[i++] || nextFunc
      let done = i > length
      let value
      let nextCalled = false

      if (fn) {
        value = fn(context, () => {
          if (nextCalled) {
            return Promise.reject(new Error('next() called multiple times'))
          }
          nextCalled = true
          return Promise.resolve(this.next().value)
        })
      }

      return {
        value,
        done
      }
    }
  }
}
