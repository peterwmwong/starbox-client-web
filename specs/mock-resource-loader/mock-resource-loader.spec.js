var __slice = Array.prototype.slice;

define(function() {
  return function(_arg) {
    var getRequire, loadModule, mockModules;
    mockModules = _arg.mockModules, loadModule = _arg.loadModule, getRequire = _arg.getRequire;
    describe('#getSync', function() {
      return describe('creates a sync function (to override Backbone.sync)', function() {
        beforeEach(function() {
          var _this = this;
          return loadModule({
            'mock-resource-loader/mock-resources': {
              res1: {
                create: this.mock_res1_create = sinon.stub().returns(this.mock_res1_create_return = {
                  a: 5
                }),
                read: this.mock_res1_read = sinon.stub()
              },
              res2: {
                create: this.mock_res2_create = sinon.stub().throws("Blah"),
                update: this.mock_res2_update = sinon.stub()
              }
            }
          }, function(mock_data_loader) {
            _this.mock_data_loader = mock_data_loader;
            return _this.sync = _this.mock_data_loader.getSync();
          });
        });
        it('should be a function', function() {
          return expect(typeof this.sync).toBe('function');
        });
        it('should be cache the function', function() {
          return expect(this.sync).toBe(this.mock_data_loader.getSync());
        });
        it('when called, should choose the appropriate resource handler', function() {
          this.sync('create', {
            url: '/res1'
          }, {
            success: (function() {}),
            error: (function() {})
          });
          expect(this.mock_res1_create.callCount).toBe(1);
          expect(this.mock_res1_read.callCount).toBe(0);
          expect(this.mock_res2_create.callCount).toBe(0);
          expect(this.mock_res2_update.callCount).toBe(0);
          this.sync('update', {
            url: '/res2'
          }, {
            success: (function() {}),
            error: (function() {})
          });
          expect(this.mock_res1_create.callCount).toBe(1);
          expect(this.mock_res1_read.callCount).toBe(0);
          expect(this.mock_res2_create.callCount).toBe(0);
          return expect(this.mock_res2_update.callCount).toBe(1);
        });
        it('when called, should pass the id and options', function() {
          var mock_model, mock_opts;
          this.sync('read', (mock_model = {
            url: '/res1/mock_id'
          }), (mock_opts = {
            success: (function() {}),
            error: (function() {})
          }));
          expect(this.mock_res1_read.callCount).toBe(1);
          return expect(this.mock_res1_read.calledWith('mock_id', mock_opts)).toBe(true);
        });
        it('when called, should pass the options (id is undefined if none supplied in url)', function() {
          var mock_model, mock_opts;
          this.sync('read', (mock_model = {
            url: '/res1'
          }), (mock_opts = {
            success: (function() {}),
            error: (function() {})
          }));
          expect(this.mock_res1_read.callCount).toBe(1);
          return expect(this.mock_res1_read.calledWith(void 0, mock_opts)).toBe(true);
        });
        it('when called, should call opts.success with resource handler result', function() {
          var mock_error, mock_success;
          this.sync('create', {
            url: '/res1'
          }, {
            success: mock_success = sinon.stub(),
            error: mock_error = sinon.stub()
          });
          expect(mock_error.called).toBe(false);
          expect(mock_success.calledOnce).toBe(true);
          return expect(mock_success.getCall(0).args[0]).toEqual(this.mock_res1_create_return);
        });
        it("when called with a url that doesn't map to a resource handler, calls opts.error", function() {
          var mock_error, mock_success;
          this.sync('create', {
            url: '/bogus_url'
          }, {
            success: mock_success = sinon.stub(),
            error: mock_error = sinon.stub()
          });
          expect(mock_success.called).toBe(false);
          expect(mock_error.calledOnce).toBe(true);
          return expect(mock_error.getCall(0).args[0]).toBe("Couldn't find mock resource handler");
        });
        it("when called with a url maps to a resource handler, BUT handler can't handle method, calls opts.error", function() {
          var mock_error, mock_success;
          this.sync('update', {
            url: '/res1'
          }, {
            success: mock_success = sinon.stub(),
            error: mock_error = sinon.stub()
          });
          expect(mock_success.called).toBe(false);
          expect(mock_error.calledOnce).toBe(true);
          return expect(mock_error.getCall(0).args[0]).toBe("Couldn't find mock resource handler");
        });
        return it("when called and resource handler throws error, calls opts.error", function() {
          var mock_error, mock_success;
          this.sync('create', {
            url: '/res2'
          }, {
            success: mock_success = sinon.stub(),
            error: mock_error = sinon.stub()
          });
          expect(mock_success.called).toBe(false);
          return expect(mock_error.calledOnce).toBe(true);
        });
      });
    });
    describe('#_getResourceRoutes', function() {
      beforeEach(function() {
        var _this = this;
        return loadModule({
          'mock-resource-loader/mock-resources': {
            res1: this.mock_res1 = {
              method1: function() {},
              method2: function() {}
            },
            res2: this.mock_res2 = {
              method3: function() {},
              method4: function() {}
            }
          }
        }, function(mock_data_loader) {
          _this.mock_data_loader = mock_data_loader;
          _this.spy_getResourceRouteParser = sinon.spy(_this.mock_data_loader, '_getResourceRouteParser');
          return _this.routes = _this.mock_data_loader._getResourceRoutes();
        });
      });
      it('generates correct url specs for resources from "mock-resource-loader/mock-resources"', function() {
        expect(this.spy_getResourceRouteParser.callCount).toEqual(2);
        expect(this.spy_getResourceRouteParser.getCall(0).calledWith('res1')).toBe(true);
        return expect(this.spy_getResourceRouteParser.getCall(1).calledWith('res2')).toBe(true);
      });
      it('returns array of [route method, resource handlers from "mock-resource-loader/mock-resources"]', function() {
        return expect(this.routes).toEqual([[this.spy_getResourceRouteParser.returnValues[0], this.mock_res1], [this.spy_getResourceRouteParser.returnValues[1], this.mock_res2]]);
      });
      return it('caches parsed routes', function() {
        expect(this.mock_data_loader._getResourceRoutes()).toBe(this.mock_data_loader._getResourceRoutes());
        return expect(this.spy_getResourceRouteParser.callCount).toEqual(2);
      });
    });
    return describe('#_getResourceRouteParser', function() {
      var validate, _getResourceRouteParser;
      _getResourceRouteParser = void 0;
      validate = function() {
        var exp, input, inputExpects, res, _i, _len, _ref, _results;
        res = arguments[0], inputExpects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        _results = [];
        for (_i = 0, _len = inputExpects.length; _i < _len; _i++) {
          _ref = inputExpects[_i], input = _ref[0], exp = _ref[1];
          _results.push((function(input, exp) {
            return it("Given '" + res + "', '" + input + "' -> " + (JSON.stringify(exp)), function() {
              var f;
              f = _getResourceRouteParser(res);
              return expect(f(input))[exp === void 0 && 'toBe' || 'toEqual'](exp);
            });
          })(input, exp));
        }
        return _results;
      };
      beforeEach(function() {
        return loadModule({
          'mock-resource-loader/mock-resources': {}
        }, function(mock_data_loader) {
          return _getResourceRouteParser = mock_data_loader._getResourceRouteParser;
        });
      });
      return validate('abc', ['/abc', {}], ['/abc/', {}], [
        '/abc/myid', {
          id: 'myid'
        }
      ]);
    });
  };
});
