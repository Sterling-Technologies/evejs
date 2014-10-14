jQuery.extend({ eve: { base: jQuery.classified(function() {
	/* Require
	-------------------------------*/
	var $ = jQuery;
	
	/* Constants
	-------------------------------*/
	/* Public.Properties
	-------------------------------*/
	/* Protected Properties
	-------------------------------*/
	/* Private Properties
	-------------------------------*/
	var __paths 	= {};
	var __settings 	= {};
	
	/* Magic
	-------------------------------*/
	/* Public.Methods
	-------------------------------*/
	/**
	 * Returns an array form of arguments
	 *
	 * @return array
	 */
	this.args = function() {
		return Array.prototype.slice.apply(arguments.callee.caller.arguments);
	};
	
	/**
	 * Get's a configuration
	 *
	 * @param string
	 * @return this
	 */
	this.config = function(key, callback) {
		require([this.path('config') + '/' + key + '.js'], callback);
		return this;
	};
	
	/**
	 * Looks for Do On Rules and starts it
	 *
	 * @param string selector
	 * @return this
	 */
	this.doon = function(selector) {
		$(selector).doon();
		return this;
	};
	
	/**
	 * Returns a programatic form
	 *
	 * @return {fojo}
	 */
	this.getForm = function() {
		return $.fojo();
	};
	
	/**
	 * Returns Url Segment based on
	 * index given.
	 *
	 * @param 	int
	 * @return 	string
	 */
	this.getUrlSegment = function(index) {
		var buffer = window.location.pathname.split('/');

		if(index < 0) {
			index = buffer.length - Math.abs(index);
		}

		return buffer[index];
	};
	
	/**
	 * Returns the path given the key
	 *
	 * @param string
	 * @return this
	 */
	this.path = function(key, value) {
		if(value) {
			__paths[key] = value;
			return this;
		}
		
		return __paths[key];
	};
	
	/**
	 * Local redirect
	 *
	 * @param string path
	 * @param string post string data
	 * @return this
	 */
	this.redirect = function(path, post) {
		post = post || '';
		window.history.pushState(post, '', path);
		return this;
	};
	
	/**
	 * Global event listener for the server
	 *
	 * @return this
	 */
	this.on = function(event, callback) {
		$(window).on(event, callback.bind(this));
		return this;
	};

	/**
	 * Global event listener for the server once
	 *
	 * @return this
	 */
	this.once = function(event, callback) {
		$(window).one(event, callback.bind(this));
		return this;
	};

	/**
	 * Stops listening to a specific event
	 *
	 * @return this
	 */
	this.off = function(event, handler) {
		if(handler) {
			$(window).unbind(event, handler);
			return this;
		}

		$(window).unbind(event);
		return this;
	};
	
	/**
	 * Starts sync capabilities
	 *
	 * @param function
	 * @return {syncopate}
	 */
	this.sync = function(callback) {
		var sync = $.eve.sync(this);
		
		if(callback) {
			sync .then(callback)
		}
		
		return sync ;
	};
	
	/**
	 * Global event trigger for the server
	 *
	 * @return this
	 */
	this.trigger = function() {
		$(window).trigger.apply($(window), arguments);
		return this;
	};
	
	/* Protected Methods
	-------------------------------*/
	/* Private Methods
	-------------------------------*/
})}});