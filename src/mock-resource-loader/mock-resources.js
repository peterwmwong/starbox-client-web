
define(function() {
  var make_beverage, _beverages, _ingredient_prices;
  _ingredient_prices = {
    Cocoa: 0.90,
    Coffee: 0.75,
    Cream: 0.25,
    'Decaf Coffee': 0.75,
    Espresso: 1.10,
    'Foamed Milk': 0.35,
    'Steamed Milk': 0.35,
    Sugar: 0.25,
    'Whipped Cream': 1.00
  };
  make_beverage = function(name, img, _ingredient_map) {
    return {
      img_url: "src/views/beverage_images/" + img,
      name: name,
      price: (function() {
        var ingr, price, units;
        price = 0.0;
        for (ingr in _ingredient_map) {
          units = _ingredient_map[ingr];
          price += _ingredient_prices[ingr] * units;
        }
        return price = Math.round(price * 100) / 100;
      })()
    };
  };
  _beverages = [
    make_beverage('Café Americano', 'caffe_americano.PNG', {
      Espresso: 3
    }), make_beverage('Café Latte', 'caffe_latte.PNG', {
      Espresso: 2,
      'Steamed Milk': 1
    }), make_beverage('Café Mocha', 'caffe_mocha.PNG', {
      Espresso: 1,
      Cocoa: 1,
      'Steamed Milk': 1,
      'Whipped Cream': 1
    }), make_beverage('Cappuccino', 'cappuccino.PNG', {
      Espresso: 2,
      'Steamed Milk': 1,
      'Foamed Milk': 1
    }), make_beverage('Coffee', 'coffee.PNG', {
      Coffee: 3,
      Sugar: 1,
      Cream: 1
    }), make_beverage('Decaf Coffee', 'coffee_decaf.PNG', {
      'Decaf Coffee': 3,
      'Sugar': 1,
      'Cream': 1
    })
  ];
  return {
    beverages: {
      create: function(id, opts) {},
      read: function(id, opts) {
        return !(id != null) && _beverages || _beverages[id];
      },
      update: function(id, opts) {},
      "delete": function(id, opts) {}
    },
    ingredients: {
      create: function(id, opts) {},
      read: function(id, opts) {},
      update: function(id, opts) {},
      "delete": function(id, opts) {}
    }
  };
});
