jQuery.eve.sync = jQuery.classified(function() {
	/* Require
	-------------------------------*/
	var $ 		= jQuery;
	var sync 	= $.syncopate;

	/* Constants
	-------------------------------*/
	/* Public Properties
	-------------------------------*/
	/* Protected Properties
	-------------------------------*/
	this._sync 	= null;
	this._scope = null;
	
	/* Private Properties
	-------------------------------*/
	/* Magic
	-------------------------------*/
	this.___construct = function(scope) {
		this.scope(scope);
	};
	
	/* Public Methods
	-------------------------------*/
	this.then = function(callback) {
		//freeze the scope
		this._scope.___freeze();
		
		this._sync.then(callback);
		
		return this;
	};
	
	this.thread = function(name, callback) {
		this._sync.thread(name, callback);
		return this;
	};
	
	this.scope = function(scope) {
		this._scope = scope;
		this._sync 	= sync()
			.scope(scope)
			.onNext(this._unfreeze.bind(scope, scope.___frozen));
		
		return this;
	};
	
	/* Protected Methods
	-------------------------------*/
	this._unfreeze = function(child, current, stack) {
		//if no more bullets and none in the chamber
		if(!child && current === null && !stack.length && this.___frozen) {
			this.___unfreeze();
		}
	};
	
	/* Private Methods
	-------------------------------*/
});