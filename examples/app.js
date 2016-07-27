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
