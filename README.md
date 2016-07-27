# Compose Iterator

Fastest iterator for middleware composition.

## Installation

```
$ npm install compose-iterator
```

## Examples

```js
const iterator = require('compose-iterator')

const middleware = []


function compose(middleware) {
  middleware[Symbol.iterator] = iterator

  const iter = middleware[Symbol.iterator]()

  return function (context, next) {
    try {
      return Promise.resolve(iter.next(context, next).value)
    } catch (err) {
      return Promise.reject(err)
    }
  }
}
```

## Badges

![](https://img.shields.io/badge/license-MIT-blue.svg)
![](https://img.shields.io/badge/status-stable-green.svg)

---

> [fundon.me](https://fundun.me) &nbsp;&middot;&nbsp;
> GitHub [@fundon](https://github.com/fundon) &nbsp;&middot;&nbsp;
> Twitter [@_fundon](https://twitter.com/_fundon)

