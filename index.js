/*!
 * use-ware <https://github.com/tunnckoCore/use-ware>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var lazy = require('./utils')

module.exports = function useWare (app, opts) {
  if (!lazy.utils.isObject(app) && typeof app !== 'function') {
    throw new TypeError('useWare: expect `app` be an object or function')
  }
  opts = lazy.utils.isObject(opts) ? opts : {}
  opts = lazy.utils.extend({
    prop: 'plugins'
  }, opts)
  opts.prop = typeof opts.prop === 'string' ? opts.prop : 'plugins'
  opts.prop = opts.prop.length > 0 ? opts.prop : 'plugins'

  if (!lazy.utils.isArray(app[opts.prop])) {
    lazy.define(app, opts.prop, [])
  }

  lazy.define(app, 'use', function use (fn, options) {
    if (typeof fn !== 'function') {
      throw new TypeError('useWare.use: expect `fn` be function')
    }
    var self = this || app
    if (typeof opts.fn === 'function') {
      opts.fn.call(self, self, options)
    }
    fn = fn.call(self, self)

    if (typeof fn === 'function') {
      self[opts.prop].push(fn)
    }
    return self
  })

  lazy.define(app, 'run', function run () {
    var self = this || app
    var len = self[opts.prop].length
    var i = 0

    while (i < len) {
      self[opts.prop][i++].apply(self, arguments)
    }
    return self
  })

  return app
}
