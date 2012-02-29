
define(function() {
  return {
    render: function(_) {
      return [
        _('.photo', _('.pin'), _('img', {
          src: this.model.get('img_url')
        })), _('.name_price', _('.name', this.model.get('name')), _('.price_drink', _('.price', "$" + (this.model.get('price').toFixed(2))), _('.drink', 'drink now!')))
      ];
    },
    on: {
      'click .drink': function() {
        return this.$el.trigger('dispenseBeverage', [this.model.id]);
      }
    }
  };
});
