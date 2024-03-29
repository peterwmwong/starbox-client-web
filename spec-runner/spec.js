
define({
  load: function(name, req, load, config) {
    return req(["" + name + ".spec"], function(Spec) {
      return load(function() {
        var ctxPostfix;
        ctxPostfix = 0;
        return describe(name, function() {
          var ctx, specRequire;
          specRequire = null;
          ctx = void 0;
          return Spec((function() {
            return {
              loadModule: function(cb_mocks, cb) {
                var ctxName, k, module, v;
                if (ctx) {
                  $("[data-requirecontext='" + ctx.contextName + "']").remove();
                }
                specRequire = require.config({
                  context: ctxName = "specs" + (ctxPostfix++),
                  baseUrl: '/src/'
                });
                ctx = window.require.s.contexts[ctxName];
                if (typeof cb === 'function' && cb_mocks) {
                  for (k in cb_mocks) {
                    v = cb_mocks[k];
                    ctx.defined[k] = v;
                    ctx.specified[k] = ctx.loaded[k] = true;
                  }
                }
                if (typeof cb_mocks === 'function') cb = cb_mocks;
                module = void 0;
                runs(function() {
                  return specRequire([name], function(mod) {
                    return module = mod;
                  });
                });
                waitsFor((function() {
                  return module !== void 0;
                }), "'" + name + "' Module to load", 1000);
                return runs(function() {
                  return cb(module);
                });
              }
            };
          })());
        });
      });
    });
  }
});
