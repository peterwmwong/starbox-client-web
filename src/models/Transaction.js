
define(function() {
  var Transaction;
  return Transaction = Backbone.Model.extend({
    urlRoot: '/transactions'
  });
});
