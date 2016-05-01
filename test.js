/*!
 * use-ware <https://github.com/tunnckoCore/use-ware>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var test = require('assertit')
var use = require('./index')
var isArray = require('./utils').utils.isArray

test('should export a function', function (done) {
  test.strictEqual(typeof use, 'function')
  done()
})

test('should decorate "use" and "run" onto the given object', function (done) {
  var app = {}
  use(app)
  test.strictEqual(typeof app.use, 'function')
  test.strictEqual(typeof app.run, 'function')
  done()
})

test('should decorate "plugins" onto the given object', function (done) {
  var app = {}
  use(app)
  test.strictEqual(isArray(app.plugins), true)
  done()
})

test('should exported function return app', function (done) {
  var app = {foo: 'bar'}
  var res = use(app)
  test.strictEqual(typeof res, 'object')
  test.strictEqual(typeof res.use, 'function')
  test.strictEqual(typeof res.run, 'function')
  test.strictEqual(res.foo, 'bar')
  test.strictEqual(res.plugins.length, 0)
  done()
})

test('should not re-add decorate methods onto the given object', function (done) {
  var app = {}
  use(app)
  test.strictEqual(isArray(app.plugins), true)
  test.strictEqual(app.plugins.length, 0)
  app.use(function () {
    return function () {}
  })
  test.strictEqual(app.plugins.length, 1)
  use(app)
  test.strictEqual(app.plugins.length, 1)
  done()
})

test('should immediately invoke a plugin function', function (done) {
  var app = {}
  use(app)
  var called = false
  app.use(function (ctx) {
    called = true
  })
  test.strictEqual(called, true)
  done()
})

test('should push returned functions onto `plugins`', function (done) {
  var app = {}
  use(app)
  app.use(function one (ctx) {
    return function () {}
  })
  app.use(function two (ctx) {
    return function () {}
  })
  app.use(function foo (ctx) {
    return function () {}
  })
  test.strictEqual(app.plugins.length, 3)
  done()
})

test('should run all plugins on "plugins"', function (done) {
  var app = {}
  use(app)
  app.use(function (ctx) {
    return function (foo) {
      foo.a = 'b'
    }
  })
  app.use(function (ctx) {
    return function (foo) {
      foo.c = 'd'
    }
  })
  app.use(function (ctx) {
    return function (foo) {
      foo.e = 'f'
    }
  })
  var foo = {foo: 'bar'}
  app.run(foo)
  test.deepEqual(foo, { foo: 'bar', a: 'b', c: 'd', e: 'f' })
  done()
})

test('should `.run` accept any number and any kind of arguments', function (done) {
  var app = {}
  use(app)
  app.use(function () {
    return function (num, str, obj, bool) {
      test.strictEqual(num, 123)
      test.strictEqual(str, 'a')
      test.strictEqual(bool, true)
      test.strictEqual(obj.b, 'c')
      test.strictEqual(obj.b, 'c')
    }
  })
  .run(123, 'a', {b: 'c'}, true)
  done()
})

test('should throw TypeError if not a function passed to `.use`', function (done) {
  var app = use({})
  function fixture () {
    app.use(123)
  }
  test.throws(fixture, TypeError)
  test.throws(fixture, /expect `fn` be function/)
  done()
})

test('should throw TypeError if `app` not an object or function', function (done) {
  function fixture () {
    use(123)
  }
  test.throws(fixture, TypeError)
  test.throws(fixture, /expect `app` be an object or function/)
  done()
})

test('should be able to customize property on which will write the plugins', function (done) {
  var app = use({}, {prop: 'abc'})
  app.use(function () {
    return function () {}
  })
  test.strictEqual(typeof app.use, 'function')
  test.strictEqual(typeof app.run, 'function')
  test.strictEqual(app.abc.length, 1)
  test.strictEqual(app.plugins, undefined)
  done()
})

test('should work to pass function as `app`', function (done) {
  function myApp () {}
  use(myApp, {prop: '_plugins'})
  myApp.use(function (fn) {
    test.strictEqual(typeof fn, 'function')
    test.strictEqual(typeof this, 'function')
    this.a = 'b'
    fn.c = 'd'
    return function (one, two, three) {
      this.e = 'f'
      fn.g = 'h'
      this.state = [one, two, three]
    }
  })
  myApp.run(1, 2, 3)
  test.strictEqual(typeof myApp.use, 'function')
  test.strictEqual(typeof myApp.run, 'function')
  test.strictEqual(myApp._plugins.length, 1)
  test.strictEqual(myApp.plugins, undefined)
  test.strictEqual(myApp.a, 'b')
  test.strictEqual(myApp.c, 'd')
  test.strictEqual(myApp.e, 'f')
  test.strictEqual(myApp.g, 'h')
  test.deepEqual(myApp.state, [1, 2, 3])
  done()
})
