
define(['cell!views/BeverageList', 'cell!views/ServingDrinkModal', 'models/Beverages', 'models/Transaction'], function(BeverageListView, ServingDrinkModalView, Beverages, Transaction) {
  return {
    render: function(_) {
      return [
        _('.modal', _(ServingDrinkModalView)), _('.blackboard', _('img', {
          src: 'src/views/blackboard2.png'
        }), _(BeverageListView))
      ];
    },
    afterRender: function() {
      var $blackboard, $window, MIN_HEIGHT, MIN_MARGIN, RATIO, onresize,
        _this = this;
      (this.$modal = this.$('.modal')).width(0);
      RATIO = 1920 / 1200;
      MIN_MARGIN = 25;
      MIN_HEIGHT = 725;
      $blackboard = this.$('.blackboard');
      ($window = $(window)).on('resize', onresize = function() {
        var cur_ratio, dheight, dwidth, height, width;
        dwidth = Math.max($window.width(), MIN_HEIGHT * RATIO);
        dheight = Math.max($window.height(), MIN_HEIGHT);
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
    _check_beverage_dispense: function(transaction) {
      var _this = this;
      return transaction.fetch({
        success: function(transaction) {
          if (transaction.get('isDone')) {
            return _this.$modal.toggleClass('enabled', false);
          } else {
            return setTimeout((function() {
              return _this._check_beverage_dispense(transaction);
            }), 500);
          }
        }
      });
    },
    on: {
      'webkitTransitionEnd .modal': function() {
        if (!this.$modal.hasClass('enabled')) return this.$modal.width(0);
      },
      'dispenseBeverage .Beverage': function(ev, id) {
        var _this = this;
        if (!this.$modal.hasClass('enabled')) {
          new Transaction({
            type: 'dispense_beverage',
            beverage_id: id
          }).save(void 0, {
            success: function(model, response) {
              return _this._check_beverage_dispense(model);
            }
          });
          this.$modal.width("100%");
          return this.$modal.toggleClass('enabled', true);
        }
      }
    }
  };
});
