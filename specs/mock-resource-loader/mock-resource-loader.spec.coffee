define -> ({mockModules,loadModule,getRequire})->

  describe '#getSync', ->
    describe 'creates a sync function (to override Backbone.sync)', ->
      beforeEach ->
        loadModule {
          'mock-resource-loader/mock-resources':
            res1:
              create: @mock_res1_create =
                sinon.stub().returns @mock_res1_create_return = a:5
              read: @mock_res1_read = sinon.stub()
            res2:
              create: @mock_res2_create = sinon.stub().throws("Blah")
              update: @mock_res2_update = sinon.stub()
        }, (@mock_data_loader)=>
          @sync = @mock_data_loader.getSync()

      it 'should be a function', ->
        expect(typeof @sync).toBe 'function'

      it 'should be cache the function', ->
        expect(@sync).toBe @mock_data_loader.getSync()

      it 'when called, should choose the appropriate resource handler', ->
        @sync 'create', url: '/res1', {success: (->), error: (->)}
        expect(@mock_res1_create.callCount).toBe 1
        expect(@mock_res1_read.callCount).toBe 0
        expect(@mock_res2_create.callCount).toBe 0
        expect(@mock_res2_update.callCount).toBe 0

        @sync 'update', url: '/res2', {success: (->), error: (->)}
        expect(@mock_res1_create.callCount).toBe 1
        expect(@mock_res1_read.callCount).toBe 0
        expect(@mock_res2_create.callCount).toBe 0
        expect(@mock_res2_update.callCount).toBe 1

      it 'when called, should pass the id and options', ->
        @sync 'read', (mock_model = url: '/res1/mock_id'), (mock_opts = {success: (->), error: (->)})
        expect(@mock_res1_read.callCount).toBe 1
        expect(@mock_res1_read.calledWith 'mock_id', mock_opts).toBe true

      it 'when called, should pass the options (id is undefined if none supplied in url)', ->
        @sync 'read', (mock_model = url: '/res1'), (mock_opts = {success: (->), error: (->)})
        expect(@mock_res1_read.callCount).toBe 1
        expect(@mock_res1_read.calledWith undefined, mock_opts).toBe true

      it 'when called, should call opts.success with resource handler result', ->
        @sync 'create', url: '/res1', {success: mock_success = sinon.stub(), error: mock_error = sinon.stub()}
        expect(mock_error.called).toBe false
        expect(mock_success.calledOnce).toBe true
        expect(mock_success.getCall(0).args[0]).toEqual @mock_res1_create_return

      it "when called with a url that doesn't map to a resource handler, calls opts.error", ->
        @sync 'create', url: '/bogus_url', {success: mock_success = sinon.stub(), error: mock_error = sinon.stub()}
        expect(mock_success.called).toBe false
        expect(mock_error.calledOnce).toBe true
        expect(mock_error.getCall(0).args[0]).toBe "Couldn't find mock resource handler"

      it "when called with a url maps to a resource handler, BUT handler can't handle method, calls opts.error", ->
        @sync 'update', url: '/res1', {success: mock_success = sinon.stub(), error: mock_error = sinon.stub()}
        expect(mock_success.called).toBe false
        expect(mock_error.calledOnce).toBe true
        expect(mock_error.getCall(0).args[0]).toBe "Couldn't find mock resource handler"

      it "when called and resource handler throws error, calls opts.error", ->
        @sync 'create', url: '/res2', {success: mock_success = sinon.stub(), error: mock_error = sinon.stub()}
        expect(mock_success.called).toBe false
        expect(mock_error.calledOnce).toBe true


  describe '#_getResourceRoutes', ->

    beforeEach ->
      loadModule {
        'mock-resource-loader/mock-resources':
          res1: @mock_res1 =
            method1: ->
            method2: ->
          res2: @mock_res2 =
            method3: ->
            method4: ->
      }, (@mock_data_loader)=>
        @spy_getResourceRouteParser = sinon.spy @mock_data_loader, '_getResourceRouteParser'
        @routes = @mock_data_loader._getResourceRoutes()

    it 'generates correct url specs for resources from "mock-resource-loader/mock-resources"', ->
      expect(@spy_getResourceRouteParser.callCount).toEqual 2
      expect(@spy_getResourceRouteParser.getCall(0).calledWith 'res1').toBe true
      expect(@spy_getResourceRouteParser.getCall(1).calledWith 'res2').toBe true

    it 'returns array of [route method, resource handlers from "mock-resource-loader/mock-resources"]', ->
      expect(@routes).toEqual [
        [@spy_getResourceRouteParser.returnValues[0], @mock_res1]
        [@spy_getResourceRouteParser.returnValues[1], @mock_res2]
      ]

    it 'caches parsed routes', ->
      expect(@mock_data_loader._getResourceRoutes()).toBe @mock_data_loader._getResourceRoutes()
      expect(@spy_getResourceRouteParser.callCount).toEqual 2

  describe '#_getResourceRouteParser', ->
    _getResourceRouteParser = undefined
    validate = (res,inputExpects...)->
      for [input, exp] in inputExpects then do(input,exp)->
        it "Given '#{res}', '#{input}' -> #{JSON.stringify exp}", ->
          f = _getResourceRouteParser res
          expect(f input)[exp is undefined and 'toBe' or 'toEqual'] exp

    beforeEach ->
      loadModule 'mock-resource-loader/mock-resources': {}, (mock_data_loader)->
        _getResourceRouteParser = mock_data_loader._getResourceRouteParser

    validate 'abc',
      ['/abc', {}]
      ['/abc/', {}]
      ['/abc/myid', {id: 'myid'}]
