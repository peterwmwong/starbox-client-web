
define(['cell!views/Beverage', 'models/Beverages'], function(BeverageView, Beverages) {
  var _;
  _ = cell.prototype.$R;
  return {
    afterRender: function() {
      var _this = this;
      return Beverages.fetch({
        success: function() {
          return _this.$el.append(Beverages.map(function(bev) {
            return _('.beverage-container', _(BeverageView, {
              model: bev
            }));
          }));
        }
      });
    }
  };
});
