
define(function() {
  var Beverage, Beverages;
  Beverage = Backbone.Model.extend();
  Beverages = Backbone.Collection.extend({
    model: Beverage,
    url: '/beverages'
  });
  return new Beverages();
});
