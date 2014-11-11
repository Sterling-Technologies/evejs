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
		return this._controller.path('user/' + key);
	};
	
	/**
	 * Returns a preset collection 
	 *
	 * @return eden/mysql/collection
	 */
	this.collection = function(rows) {
		var collection = this._controller.database().collection('user');
		
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
		
		//VALIDATION
		//NOTE: BULK GENERATE
		if(!data.user_name || !data.user_name.length) {
			errors.push({ name: 'user_name', message: 'Name is required!' });
		} 
		
		if(!data.user_email || !data.user_email.length) {
			errors.push({ name: 'user_email', message: 'Email is required!' });
		} else if(data.user_email && !(new RegExp(
			'^(([^<>()[\\]\\.,,:\\s@\\"]+(\\.[^<>()[\\]\\.,,:\\s@\\"]+)*)|(\\' + 
			'".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}' + 
			'\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$', 'ig'))
			.test(data.user_email)) {
			errors.push({ name: 'user_email', message: 'Email is not a valid email' });
		} 
		
		
		return errors;
	};
	
	/**
	 * Returns a unique valid slug
	 *
	 * @param string
	 * @param string
	 * @param function
	 * @return this
	 */
	this.getSlug = function(title, old, callback) {
		var slug = this.String().dasherize(title).substr(0, 250);

		//old is passed when updating
		//if the title to slug didn't change
		var regex = new RegExp('^'+slug.replace(/\-/ig, '\\-')+'(\\-[0-9]+)*$', 'ig');
		
		if(old && regex.test(old)) {
			callback(null, old);
			return this;
		}

		this._controller
			.database()
			.search('user')
			.addFilter('user_slug LIKE ?', slug+'%')
			.getRows(function(error, rows) {
				if(error) {
					callback(error, null);
					return;
				}
				
				for(var count = 0, i = 0; i < rows.length; i++) {
					if(regex.test(rows[i].user_slug)) {
							count++;
					}
				}

				if(count) {
					callback(null, slug+'-'+count);
					return;
				}

				callback(null, slug);
			});

		return this;
	};
	
	/**
	 * Returns a preset model
	 *
	 * @return eden/mysql/model
	 */
	this.model = function(data) {
		var model = this._controller.database().model('user');
		
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
		return this._controller.database().search('user');
	};
	
	/* Protected Methods
	-------------------------------*/
	/* Private Methods
	-------------------------------*/
}).singleton();