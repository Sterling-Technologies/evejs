module.exports = require('edenjs').extend(function() {
	/* Require
	-------------------------------*/
	/* Constants
	-------------------------------*/
	/* Public Properties
	-------------------------------*/
	/* Protected Properties
	-------------------------------*/
	this._controller = null;
	
	/* Private Properties
	-------------------------------*/
	/* Magic
	-------------------------------*/
	this.___construct = function(controller) {
		this._controller = controller;
	};
	
	/* Public Methods
	-------------------------------*/
	/**
	 * Returns a package folder given the key
	 *
	 * @param string the key
	 * @return string the absolute path
	 */
	this.path = function(key) {
		return this._controller.path('sink/' + key);
	};
	
	/**
	 * Returns a preset collection 
	 *
	 * @return eden/mysql/collection
	 */
	this.collection = function(rows) {
		var collection = this._controller.database().collection('sink');
		
		if(rows instanceof Array) {
			collection.set(rows);
		}
		
		return collection;
	};
	
	/**
	 * Validates fields to be sent to the database
	 * and returns errors
	 *
	 * @param object
	 * @return object hash of errors
	 */
	this.getErrors = function(data) {
		var errors = [];
		
		return errors;
	};
	
	/**
	 * Returns a preset model
	 *
	 * @return eden/mysql/model
	 */
	this.model = function(data) {
		var model = this._controller.database().model('sink');
		
		if(typeof data === 'object' && data !== null) {
			model.___construct(data);
		}
		
		return model;
	};
	
	/**
	 * Returns a preset search
	 *
	 * @return eden/mysql/search
	 */
	this.search = function() {
		return this._controller.database().search('sink');
	};
	
	/* Protected Methods
	-------------------------------*/
	/* Private Methods
	-------------------------------*/
}).singleton();