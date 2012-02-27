define ['mock-resource-loader/mock-resources'], (resources)->
  routeCache = undefined
  syncCache = undefined

  module =

    _getResourceRoutes: ->
      routeCache or routeCache =
        for resource, resource_handler_map of resources
          [module._getResourceRouteParser(resource), resource_handler_map]

    _getResourceRouteParser: (resource)->
      rx = new RegExp "/#{resource}(/(\\w*))?"
      (path)->
        if m = rx.exec path
          if id = m[2] then {id}
          else {}

    # Backbone.sync
    getSync: ->
      err = (opts)-> opts.error "Couldn't find mock resource handler"
      syncCache or syncCache = (method, model, opts)->
        url = (typeof model.url is 'function') and model.url() or model.url
        for [route, handler_map] in module._getResourceRoutes() when m = route url
          if handler = handler_map[method]
            try
              opts.success handler m.id, opts
            catch e
              opts.error e
          else
            err opts
          return

        err opts
        return
