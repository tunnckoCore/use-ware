/*!
 * use-ware <https://github.com/tunnckoCore/use-ware>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var utils = require('./utils')

module.exports = function useWare (app) {
  if (!utils.isObject(app) && typeof app !== 'function') {
    return app
  }
  if (!utils.isArray(app.____plugins)) {
    utils.define(app, '____plugins', [])
  }

  utils.define(app, 'use', function use (fn) {
    if (typeof fn !== 'function') {
      throw new TypeError('useWare.use: expect `fn` be function')
    }
    var self = this || app
    fn = fn.call(self, self)

    if (typeof fn === 'function') {
      self.____plugins.push(fn)
    }
    return self
  })

  utils.define(app, 'run', function run () {
    var self = this || app
    var len = self.____plugins.length
    var i = 0

    while (i < len) {
      self.____plugins[i++].apply(self, arguments)
    }
    return self
  })
}
