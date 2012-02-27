
define(['cell!views/BeverageList', 'cell!views/ServingDrinkModal', 'models/Beverages'], function(BeverageListView, ServingDrinkModalView, Beverages) {
  return {
    render: function(_) {
      return [_('.modal', _(ServingDrinkModalView)), _('.blackboard', _(BeverageListView))];
    },
    afterRender: function() {
      var $blackboard, $window, MIN_MARGIN, RATIO, onresize,
        _this = this;
      this.$modal = this.$('.modal');
      RATIO = 1920 / 1200;
      MIN_MARGIN = 25;
      $blackboard = this.$('.blackboard');
      ($window = $(window)).on('resize', onresize = function() {
        var cur_ratio, dheight, dwidth, height, width;
        dwidth = Math.max($window.width(), 1280);
        dheight = Math.max($window.height(), 1280 / RATIO);
        cur_ratio = dwidth / dheight;
        if (cur_ratio === Infinity || isNaN(cur_ratio)) {
          return setTimeout(onresize, 50);
        } else {
          if (cur_ratio > RATIO) {
            height = dheight;
            width = height * RATIO;
          } else {
            width = dwidth;
            height = width / RATIO;
          }
          return $blackboard.width(width - 2 * MIN_MARGIN).height(height - 2 * MIN_MARGIN);
        }
      });
      return onresize();
    },
    on: {
      'drinkRequest .Beverage': function() {
        var _this = this;
        if (!this.$modal.hasClass('enabled')) {
          this.$modal.toggleClass('enabled', true);
          return setTimeout((function() {
            return _this.$modal.toggleClass('enabled', false);
          }), 2000);
        }
      }
    }
  };
});
