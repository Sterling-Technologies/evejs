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
		return this._controller.path('auth/' + key);
	};
	
	/**
	 * Returns a preset collection 
	 *
	 * @return eden/mysql/collection
	 */
	this.collection = function(rows) {
		var collection = this._controller.database().collection('auth');
		
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
		if(!data.auth_user) {
			errors.push({ name: 'auth_user', message: 'Email/Name is required!' });
		} 
		
		if(!data.auth_password) {
			errors.push({ name: 'auth_password', message: 'Password is required!' });
		}
		
		return errors;
	};
	
	/**
	 * Returns a preset model
	 *
	 * @return eden/mysql/model
	 */
	this.model = function(data) {
		var model = this._controller.database().model('auth');
		
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
		return this._controller.database().search('auth');
	};
	
	/**
	 * Install to database programmatically
	 *
	 * @param boolean
	 * @param function
	 * @return this
	 */
	this.install = function(fixtures, callback) {
		var database = this._controller.database();
		this
		//drop
		.sync(function(next) {
			database.query('DROP TABLE IF EXISTS `auth`;', next);
		})
		//create
		.then(function(error, rows, meta, next) {
			if(error) {
				callback(error);
				return;
			}
			
			var schema = [];
			
			schema.push('CREATE TABLE IF NOT EXISTS `auth` (');
			schema.push('`auth_id` varchar(255) NOT NULL,');
			schema.push('`auth_user` int(10) unsigned NOT NULL,');
			
			var last = schema[schema.length - 1];
			schema[schema.length - 1] = last.substr(0, last.length - 1);
			schema.push(') ENGINE=InnoDB DEFAULT CHARSET=latin1;');
				
			database.query(schema.join("\n"), next);
		})
		
		//add primary
		.then(function(error, rows, meta, next) {
			if(error) {
				callback(error);
				return;
			}
			
			database.query('ALTER TABLE `auth` ADD PRIMARY KEY (`auth_id`);', next);
		})
		
		//add auto increment
		.then(function(error, rows, meta, next) {
			if(error) {
				callback(error);
				return;
			}
			
			database.query('ALTER TABLE `auth` MODIFY `auth_id` int(10) unsigned NOT NULL AUTO_INCREMENT;', 
			next);
		})
		
		.then(function(error, rows, meta, next) {
			if(error) {
				callback(error);
				return;
			}
			
			next();
		})
		//finish up
		.then(function(next) {
			callback(null);
		});
		
		return this;
	};
	
	/* Protected Methods
	-------------------------------*/
	/* Private Methods
	-------------------------------*/
}).singleton();