define ->

  _ingredients =
    Cocoa: 0.90
    Coffee: 0.75
    Cream: 0.25
    'Decaf Coffee': 0.75
    Espresso: 1.10
    'Foamed Milk': 0.35
    'Steamed Milk': 0.35
    Sugar: 0.25
    'Whipped Cream': 1.00

  _stock = {}
  for k,v of _ingredients
    _stock[k] = 25

  make_beverage = do->
    id = 0
    (name, img, _ingredient_map)->
      id: id++
      img_url: "src/views/beverage_images/#{img}"
      name: name
      ingredients: _ingredient_map
      price: do->
        price = 0.0
        for ingr, units of _ingredient_map
          price += _ingredients[ingr] * units
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

    make_beverage 'Coffee', 'coffee.PNG',
      Coffee:3
      Sugar:1
      Cream:1

    make_beverage 'Decaf Coffee', 'coffee_decaf.PNG',
      'Decaf Coffee':3
      'Sugar':1
      'Cream':1
  ]

  beverages:
    read:   (id,data)-> not id? and _beverages or _beverages[id]
    update: (id,data)->

  ingredients:
    read:   (id,data)->
    update: (id,data)->

  transactions: do->
    inprogress = {}
    create: (id,data)->
      switch data.type
        when 'dispense_beverage'
          bev = _beverages[data.beverage_id]
          console.log "dispense_beverage #{data.beverage_id} : #{bev.name}"
          for ingr,units of bev.ingredients
            if _stock[ingr] >= units
              _stock[ingr] -= units
            else
              return error: "Not enough #{ingr} to make beverage"

          inprogress[id = Math.round(1000*Math.random())] = Date.now()
          {id}
    read: (id,data)->
      isDone = true
      if id and (start = inprogress[Number(id)])
        if start + 2000 < Date.now()
          delete inprogress[Number(id)]
        else
          isDone = false
      {id,isDone}
