define ['cell!views/Beverage','models/Beverages'], (BeverageView, Beverages)->
  _ = cell::$R

  afterRender: ->
    Beverages.fetch
      success: =>
        @$el.append Beverages.map (bev)->
          _ '.beverage-container',
            _ BeverageView, model: bev