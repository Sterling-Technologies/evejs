module.exports = (function() {
	var Definition = function(controller) {
		this.__construct.call(this, controller);	
	}, prototype = Definition.prototype;
	
	/* Properties
	-------------------------------*/
	var store 	= require('./store');
	
	/* Loader
	-------------------------------*/
	prototype.__load = Definition.load = function(controller) {
		if(!this.__instance) {
			this.__instance = new Definition(controller);
		}
		
		return this.__instance;
	};
	
	/* Construct
	-------------------------------*/
	prototype.__construct = function(controller) {
		this.controller = controller;
	};
	
	/* Public Methods
	-------------------------------*/
	prototype.store = function() {
		return store.load();
	};
	
	prototype.path = function(key) {
		return this.controller.path('{SLUG}/' + key);
	};
	
	/* Private Methods
	-------------------------------*/
	/* Adaptor
	-------------------------------*/
	return Definition;  
})();