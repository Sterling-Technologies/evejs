module.exports = function() {
	var c = function(controller) {
		this.__construct.call(this, controller);	
	}, public = c.prototype;
	
	/* Properties
	-------------------------------*/
	var store 	= require('./store');
	
	/* Loader
	-------------------------------*/
	public.__load = c.load = function(controller) {
		if(!this.__instance) {
			this.__instance = new c(controller);
		}
		
		return this.__instance;
	};
	
	/* Construct
	-------------------------------*/
	public.__construct = function(controller) {
		this.controller = controller;
	};
	
	/* Public Methods
	-------------------------------*/
	public.store = function() {
		return store.load();
	};
	
	public.path = function(key) {
		return this.controller.path('user/' + key);
	};
	
	/* Private Methods
	-------------------------------*/
	/* Adaptor
	-------------------------------*/
	return c;  
}();