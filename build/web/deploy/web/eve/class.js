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
	this.form = function() {
		return $.fojo();
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
	
	/* Protected Methods
	-------------------------------*/
	/* Private Methods
	-------------------------------*/
})}});