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
    const iter = iterator[Symbol.iterator](middleware, middleware.length, context, next)

    try {
      return Promise.resolve(iter.next().value)
    } catch (err) {
      return Promise.reject(err)
    }
  }
}
