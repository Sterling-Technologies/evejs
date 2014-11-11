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
		return this._controller.path('file/' + key);
	};
	
	/**
	 * Returns a preset collection 
	 *
	 * @return eden/mysql/collection
	 */
	this.collection = function(rows) {
		var collection = this._controller.database().collection('file');
		
		if(rows instanceof Array) {
			collection.set(rows);
		}
		
		return collection;
	};
	
	/**
	 * Returns a preset model
	 *
	 * @return eden/mysql/model
	 */
	this.model = function(data) {
		var model = this._controller.database().model('file');
		
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
		return this._controller.database().search('file');
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
			database.query('DROP TABLE IF EXISTS `file`;', next);
		})
		//create
		.then(function(error, rows, meta, next) {
			if(error) {
				callback(error);
				return;
			}
			
			var schema = [];
			schema.push('CREATE TABLE `file` (');
			schema.push('`file_id` int(10) unsigned NOT NULL,');
			schema.push("`file_name` varchar(255) NOT NULL,");
			schema.push("`file_path` varchar(255) NOT NULL,");
			schema.push("`file_mime` varchar(255) NOT NULL,");
			schema.push('`file_active` int(1) unsigned NOT NULL DEFAULT \'1\',');
			schema.push('`file_created` int(1) datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,');
			
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
			
			database.query('ALTER TABLE `file` ADD PRIMARY KEY (`file_id`);', next);
		})
		
		//add auto increment
		.then(function(error, rows, meta, next) {
			if(error) {
				callback(error);
				return;
			}
			
			database.query('ALTER TABLE `file` MODIFY `file_id` int(10) unsigned NOT NULL AUTO_INCREMENT;', 
			next);
		})
		
		//finish up
		.then(function(error, rows, meta, next) {
			if(error) {
				callback(error);
				return;
			}
			
			callback(null);
		});
		
		
		return this;
	};
	
	/* Protected Methods
	-------------------------------*/
	/* Private Methods
	-------------------------------*/
}).singleton();