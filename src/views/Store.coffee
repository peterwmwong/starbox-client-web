define [
  'cell!views/BeverageList'
  'cell!views/ServingDrinkModal'
  'models/Beverages'
  'models/Transaction'
], (BeverageListView, ServingDrinkModalView, Beverages, Transaction)->

  render: (_)-> [
    _ '.modal',
      _ ServingDrinkModalView
    _ '.blackboard',
      _ 'img', src: 'src/views/blackboard2.png'
      _ BeverageListView
  ]

  afterRender: ->
    (@$modal = @$('.modal')).width(0)

    # Maintain 1920 x 1200 proportions for blackboard
    RATIO = 1920 / 1200
    MIN_MARGIN = 25
    MIN_HEIGHT = 725
    $blackboard = @$ '.blackboard'
    ($window = $ window).on 'resize', onresize = =>
      dwidth = Math.max $window.width(), MIN_HEIGHT*RATIO
      dheight = Math.max $window.height(), MIN_HEIGHT
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

  _check_beverage_dispense: (transaction)->
    transaction.fetch
      success: (transaction)=>
        if transaction.get 'isDone'
          @$modal.toggleClass 'enabled', false
        else
          setTimeout (=> @_check_beverage_dispense transaction), 500

  on:
    'webkitTransitionEnd .modal': ->
      @$modal.width 0 unless @$modal.hasClass 'enabled'

    'dispenseBeverage .Beverage': (ev,id)->
      # Ignore if we're already serving up a drink
      unless @$modal.hasClass 'enabled'
        new Transaction(type:'dispense_beverage', beverage_id: id)
          .save undefined,
            success: (model, response)=> @_check_beverage_dispense model

        @$modal.width "100%"
        @$modal.toggleClass 'enabled', true
