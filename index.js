/*!
 * use-ware <https://github.com/tunnckoCore/use-ware>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var lazy = require('./utils')

module.exports = function useWare (app, prop) {
  if (!lazy.utils.isObject(app) && typeof app !== 'function') {
    throw new TypeError('useWare: expect `app` be an object or function')
  }
  prop = typeof prop === 'string' && prop.length > 0 ? prop : 'plugins'
  if (!lazy.utils.isArray(app[prop])) {
    lazy.define(app, prop, [])
  }

  lazy.define(app, 'use', function use (fn) {
    if (typeof fn !== 'function') {
      throw new TypeError('useWare.use: expect `fn` be function')
    }
    var self = this || app
    fn = fn.call(self, self)

    if (typeof fn === 'function') {
      self[prop].push(fn)
    }
    return self
  })

  lazy.define(app, 'run', function run () {
    var self = this || app
    var len = self[prop].length
    var i = 0

    while (i < len) {
      self[prop][i++].apply(self, arguments)
    }
    return self
  })

  return app
}
