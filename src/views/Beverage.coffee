define ->
  render: (_)-> [
    _ '.photo',
      _ '.pin'
      _ 'img', src: @model.get 'img_url'
    _ '.name_price',
      _ '.name', @model.get 'name'
      _ '.price_drink',
        _ '.price', "$#{@model.get('price').toFixed(2)}"
        _ '.drink', 'drink now!'
  ]

  on:
    'click .drink': ->
      @$el.trigger 'dispenseBeverage', [@model.id]