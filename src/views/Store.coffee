define [
  'cell!views/BeverageList'
  'cell!views/ServingDrinkModal'
  'models/Beverages'
], (BeverageListView, ServingDrinkModalView, Beverages)->

  render: (_)-> [
    _ '.modal',
      _ ServingDrinkModalView
    _ '.blackboard',
      _ BeverageListView
  ]

  afterRender: ->
    @$modal = @$('.modal')

    # Maintain 1920 x 1200 proportions for blackboard
    RATIO = 1920 / 1200
    MIN_MARGIN = 25
    $blackboard = @$ '.blackboard'
    ($window = $ window).on 'resize', onresize = =>
      dwidth = Math.max($window.width(), 1280)
      dheight = Math.max($window.height(), 1280/RATIO)
      cur_ratio = dwidth / dheight

      # If blackboard hasn't been sized yet (image hasn't loaded, browser layout hadn't occurred)
      if cur_ratio is Infinity or isNaN cur_ratio
        setTimeout onresize, 50 # try later...

      else
        if cur_ratio > RATIO
          height = dheight
          width = height * RATIO
        else
          width = dwidth
          height = width / RATIO

        $blackboard
          .width(width - 2*MIN_MARGIN)
          .height(height - 2*MIN_MARGIN)

    onresize()

  on:
    'drinkRequest .Beverage': ->
      # Ignore if we're already serving up a drink
      unless @$modal.hasClass 'enabled'
        @$modal.toggleClass 'enabled', true
        setTimeout (=>
          @$modal.toggleClass 'enabled', false
        ), 2000
