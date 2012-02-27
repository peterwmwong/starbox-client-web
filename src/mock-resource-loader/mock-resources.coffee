define ->

  _ingredient_prices =
    Cocoa: 0.90
    Coffee: 0.75
    Cream: 0.25
    'Decaf Coffee': 0.75
    Espresso: 1.10
    'Foamed Milk': 0.35
    'Steamed Milk': 0.35
    Sugar: 0.25
    'Whipped Cream': 1.00

  make_beverage = (name, img, _ingredient_map)->
    img_url: "src/views/beverage_images/#{img}"
    name: name
    price: do->
      price = 0.0
      for ingr, units of _ingredient_map
        price += _ingredient_prices[ingr] * units
      price = Math.round(price * 100) / 100

  _beverages = [
    make_beverage 'Café Americano', 'caffe_americano.PNG',
      Espresso:3

    make_beverage 'Café Latte', 'caffe_latte.PNG',
      Espresso: 2
      'Steamed Milk':1

    make_beverage 'Café Mocha', 'caffe_mocha.PNG',
      Espresso: 1
      Cocoa: 1
      'Steamed Milk':1
      'Whipped Cream':1

    make_beverage 'Cappuccino', 'cappuccino.PNG',
      Espresso:2
      'Steamed Milk':1
      'Foamed Milk':1

    make_beverage 'Coffee', 'coffee.PNG'
      Coffee:3
      Sugar:1
      Cream:1

    make_beverage 'Decaf Coffee', 'coffee_decaf.PNG'
      'Decaf Coffee':3
      'Sugar':1
      'Cream':1
  ]

  beverages:
    create: (id,opts)->
    read:   (id,opts)-> not id? and _beverages or _beverages[id]
    update: (id,opts)->
    delete: (id,opts)->

  ingredients:
    create: (id,opts)->
    read:   (id,opts)->
    update: (id,opts)->
    delete: (id,opts)->
