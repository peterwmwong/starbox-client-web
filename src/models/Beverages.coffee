define ->
  Beverage = Backbone.Model.extend()
  Beverages = Backbone.Collection.extend
    model: Beverage
    url: '/beverages'
  new Beverages()