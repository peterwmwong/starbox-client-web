
define(['mock-resource-loader/mock-resources'], function(resources) {
  var module, routeCache, syncCache;
  routeCache = void 0;
  syncCache = void 0;
  return module = {
    _getResourceRoutes: function() {
      var resource, resource_handler_map;
      return routeCache || (routeCache = (function() {
        var _results;
        _results = [];
        for (resource in resources) {
          resource_handler_map = resources[resource];
          _results.push([module._getResourceRouteParser(resource), resource_handler_map]);
        }
        return _results;
      })());
    },
    _getResourceRouteParser: function(resource) {
      var rx;
      rx = new RegExp("/" + resource + "(/(\\w*))?");
      return function(path) {
        var id, m;
        if (m = rx.exec(path)) {
          if (id = m[2]) {
            return {
              id: id
            };
          } else {
            return {};
          }
        }
      };
    },
    getSync: function() {
      var err;
      err = function(opts) {
        return opts.error("Couldn't find mock resource handler");
      };
      return syncCache || (syncCache = function(method, model, opts) {
        var handler, handler_map, m, route, url, _i, _len, _ref, _ref2;
        url = (typeof model.url === 'function') && model.url() || model.url;
        _ref = module._getResourceRoutes();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          _ref2 = _ref[_i], route = _ref2[0], handler_map = _ref2[1];
          if (!(m = route(url))) continue;
          if (handler = handler_map[method]) {
            setTimeout((function() {
              try {
                return opts.success(handler(m.id, JSON.parse(JSON.stringify(model.toJSON())), opts));
              } catch (e) {
                return opts.error(e);
              }
            }), 100);
          } else {
            err(opts);
          }
          return;
        }
        err(opts);
      });
    }
  };
});
