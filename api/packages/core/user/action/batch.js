module.exports = (function() { 
    var c = function(controller, request, response) {
        this.__construct.call(this, controller, request, response);
    }, public = c.prototype;
    
    /* Public Properties
    -------------------------------*/
    public.controller   = null;
    public.request      = null;
    public.response     = null;
    public.results      = [];

    /* Private Properties
    -------------------------------*/
    /* Loader
    -------------------------------*/
    public.__load = c.load = function(controller, request, response) {
        return new c(controller, request, response);
    };
    
    /* Construct
    -------------------------------*/
     public.__construct = function(controller, request, response) {
        //set request and other usefull data
        this.controller = controller;
        this.request    = request;
        this.response   = response;
     };
     
    /* Public Methods
    -------------------------------*/
    public.render = function() {
        //set batch to true
        public.response.batch = true;

        //listen for a user action
        var setResults = this.controller.eden.alter(_setResults, this);
        this.controller.once('user-action-response', setResults);

        //get the batch of requests
        var batch = JSON.parse(this.request.message);

        //Loop the all the batch request
        for(var action, i = 0; i < batch.length; i++) {
            //now call the actions based on the method
            switch(batch[i].method.toLowerCase()) {
                case 'create':  action = require('./create');  break;
                case 'remove':  action = require('./remove');  break;
                case 'update':  action = require('./update');  break;
                case 'detail':  action = require('./detail');  break;
                case 'restore':  action = require('./restore');  break;
                case 'list':  action = require('./list');   break;
                case 'add/address': action = require('./add/address'); break;
                case 'add/phone': action = require('./add/phone'); break;
                case 'add/photo': action = require('./add/photo'); break;
            }

            action.load(this.controller, request, response).render();
        }
    };
     
    /* Private Methods
    -------------------------------*/
    var _setResults = function(request, response) {
        //All results will be push to the array results
        this.results.push(response.message);

        //If results is equal to request query
        if(this.results.length == request.query.batch.length) {
            //All batch results will be JSON stringify
            response.message = JSON.stringify({ batch:results });

            //Been trigger to the user action
            this.controller.server.trigger('response', request, response);
        }
    };
     
    /* Adaptor
    -------------------------------*/
     return c;
})();