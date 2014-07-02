module.exports = (function() {
	var c = function(controller, request, response) {
        this.__construct.call(this, controller, request, response);
    }, public = c.prototype;

	/* Public Properties
    -------------------------------*/
    public.controller  	= null;
    public.request   	= null;
    public.response  	= null;
    
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
		this.request  	= request;
		this.response  	= response;
	};

	/* Public Methods
    -------------------------------*/
	public.render = function() {
		//figure out the query and stuffs
		var filter 	= this.request.query.filter 	|| {},
			range 	= this.request.query.range 		|| 50,
			start 	= this.request.query.start 		|| 0,
			order 	= this.request.query.order 		|| {},
			count	= this.request.query.count 		|| 0,
			keyword	= this.request.query.keyword 	|| null;
		
		//remember the scope and load up the data store
		var store = this.controller.file().store();
		
		//if we just want the count based from the query
		if(count) {
			//execute the count query
			return store.getTotal(filter, keyword, _response.bind(this));
		} 
		
		//set up the store for results
		store.getList(
			filter, 	keyword,
			order, 		start,
			range, 		_response.bind(this));
	};
	
	/* Private Methods
    -------------------------------*/
    var _response = function(error, data) {
		//if there are errors
		if(error) {
			_error.call(this, error);
			return;
		}
		
		//no error
		_success.call(this, data);
	};
	
	var _success = function(data) {
		//then prepare the package
		this.response.message = JSON.stringify({ 
			error: false, 
			results: data });
		
		//trigger that a response has been made
		this.controller.trigger('file-action-response', this.request, this.response);
	};
	
	var _error = function(error) {
		//setup an error response
		this.response.message = JSON.stringify({ 
			error: true, 
			message: error.message });
		
		//trigger that a response has been made
		this.controller.trigger('file-action-response', this.request, this.response);
	};

	/* Adaptor
	-------------------------------*/
	return c; 
})();