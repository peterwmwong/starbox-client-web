
define(function() {
  var k, make_beverage, v, _beverages, _ingredients, _stock;
  _ingredients = {
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
  _stock = {};
  for (k in _ingredients) {
    v = _ingredients[k];
    _stock[k] = 25;
  }
  make_beverage = (function() {
    var id;
    id = 0;
    return function(name, img, _ingredient_map) {
      return {
        id: id++,
        img_url: "src/views/beverage_images/" + img,
        name: name,
        ingredients: _ingredient_map,
        price: (function() {
          var ingr, price, units;
          price = 0.0;
          for (ingr in _ingredient_map) {
            units = _ingredient_map[ingr];
            price += _ingredients[ingr] * units;
          }
          return price = Math.round(price * 100) / 100;
        })()
      };
    };
  })();
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
      read: function(id, data) {
        return !(id != null) && _beverages || _beverages[id];
      },
      update: function(id, data) {}
    },
    ingredients: {
      read: function(id, data) {},
      update: function(id, data) {}
    },
    transactions: (function() {
      var inprogress;
      inprogress = {};
      return {
        create: function(id, data) {
          var bev, ingr, units, _ref;
          switch (data.type) {
            case 'dispense_beverage':
              bev = _beverages[data.beverage_id];
              console.log("dispense_beverage " + data.beverage_id + " : " + bev.name);
              _ref = bev.ingredients;
              for (ingr in _ref) {
                units = _ref[ingr];
                if (_stock[ingr] >= units) {
                  _stock[ingr] -= units;
                } else {
                  return {
                    error: "Not enough " + ingr + " to make beverage"
                  };
                }
              }
              inprogress[id = Math.round(1000 * Math.random())] = Date.now();
              return {
                id: id
              };
          }
        },
        read: function(id, data) {
          var isDone, start;
          isDone = true;
          if (id && (start = inprogress[Number(id)])) {
            if (start + 2000 < Date.now()) {
              delete inprogress[Number(id)];
            } else {
              isDone = false;
            }
          }
          return {
            id: id,
            isDone: isDone
          };
        }
      };
    })()
  };
});
