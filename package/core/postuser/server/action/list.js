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
		var filter 	= this.request.query.filter 	|| {},
			range 	= this.request.query.range 		|| 50,
			start 	= this.request.query.start 		|| 0,
			order 	= this.request.query.order 		|| {},
			count	= this.request.query.count 		|| 0,
			keyword	= this.request.query.keyword 	|| null;
		
		if(count) {
			this.controller.postuser().store().getTotal(
				filter, 	keyword, 
				_response.bind(this));
			
			return;
		}
		
		this.controller.postuser().store().getList(
			filter, 	keyword, 
			order, 		start, 
			range,		_response.bind(this));
	};
	
	/* Private Methods
    -------------------------------*/
    var _response = function(error, data) {
		//if there are errors
		if(error) {
			//setup an error response
			this.response.message = JSON.stringify({ 
				error: true, 
				message: error.message });
			
			//trigger that a response has been made
			this.controller.trigger('postuser-action-response', this.request, this.response);
			return;
		}
		
		//no error, then prepare the package
		this.response.message = JSON.stringify({ 
			error: false, 
			results: data });
		
		//trigger that a response has been made
		this.controller.trigger('postuser-action-response', this.request, this.response);
	};

	/* Adaptor
	-------------------------------*/
	return c; 
})();