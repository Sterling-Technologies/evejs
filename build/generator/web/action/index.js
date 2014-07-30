define(function() {
    var Definition = function() {
		this.__construct.call(this);
	}, prototype = Definition.prototype;
	
	/* Public Properties
	-------------------------------*/
	/* Private Properties
	-------------------------------*/
	/* Loader
	-------------------------------*/
	prototype.__load = Definition.load = function() {
		return new Definition();
	};
	
	/* Construct
	-------------------------------*/
	prototype.__construct = function() {
		//reset data because of "pass by ref"
		this.data = {};
	};
	
	/* Public Methods
	-------------------------------*/
	prototype.render = function() {
		return this;
	};
	
	/* Private Methods
	-------------------------------*/
	/* Adaptor
	-------------------------------*/
	return Definition; 
});