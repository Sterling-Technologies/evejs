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
			database.query('DROP TABLE IF EXISTS `user`;', next);
		})
		//create
		.then(function(error, rows, meta, next) {
			if(error) {
				callback(error);
				return;
			}
			
			var schema = [];
			schema.push('CREATE TABLE `user` (');
			schema.push('`user_id` int(10) unsigned NOT NULL,');
			schema.push('`user_slug` varchar(255) NOT NULL,');
			schema.push("`user_name` varchar(255) NOT NULL,");
			schema.push("`user_email` varchar(255) NOT NULL,");
			schema.push("`user_password` varchar(255) NOT NULL,");
			schema.push("`user_phone` varchar(255) NOT NULL,");
			schema.push("`user_street` varchar(255) NOT NULL,");
			schema.push("`user_city` varchar(255) NOT NULL,");
			schema.push("`user_state` varchar(255) NOT NULL,");
			schema.push("`user_country` varchar(255) NOT NULL,");
			schema.push("`user_postal` varchar(255) NOT NULL,");
			schema.push("`user_facebook` varchar(255) NOT NULL,");
			schema.push("`user_twitter` varchar(255) NOT NULL,");
			schema.push("`user_google` varchar(255) NOT NULL,");
			schema.push('`user_active` int(1) unsigned NOT NULL DEFAULT \'1\',');
			schema.push('`user_created` int(1) datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,');
			schema.push('`user_updated` int(1) datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,');
			
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
			
			database.query('ALTER TABLE `user` ADD PRIMARY KEY (`user_id`);', next);
		})
		
		//add slug
		.then(function(error, rows, meta, next) {
			if(error) {
				callback(error);
				return;
			}
			
			database.query('ALTER TABLE `user` ADD UNIQUE KEY `user_slug` (`user_slug`);', next);
		})
		//add auto increment
		.then(function(error, rows, meta, next) {
			if(error) {
				callback(error);
				return;
			}
			
			database.query('ALTER TABLE `user` MODIFY `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT;', 
			next);
		})
		
		.then(function(error, rows, meta, next) {
			if(error) {
				callback(error);
				return;
			}
			
			if(!fixtures) {
				callback(null);
				return;
			}
			
			next();
		})
		
		.then(function(next) {
			var model = database.model('_user');
			
			model.___construct({
				user_slug: 'jane-doe',
				user_name: 'Jane Doe',
				user_email: 'jane@acme.com',
				user_phone: '+1 (415) 555-2121',
				user_street: '123 Sesame Street',
				user_city: 'Makati City',
				user_state: 'Metro Manila',
				user_country: 'PH',
				user_postal: '12345',
				user_facebook: 'http://www.facebook.com/jane.doe',
				user_twitter: 'http://www.twitter.com/jane.doe',
				user_google: 'http://plus.google.com/john.doe',
				user_active: '1',
				user_created: '2014-08-01 00:00:00',
				user_updated: '2014-09-01 00:00:00',
				
			});
			
			model.save(function(error) {
				if(error) {
					callback(error);
					return;
				}
				
				next();		
			}.bind(this));
		})
		.then(function(next) {
			var model = database.model('_user');
			
			model.___construct({
				user_slug: 'james-doe',
				user_name: 'James Doe',
				user_email: 'james@acme.com',
				user_phone: '+1 (415) 555-2222',
				user_street: '234 Sesame Street',
				user_city: 'Mandaluyong City',
				user_state: 'Metro Manila',
				user_country: 'PH',
				user_postal: '23456',
				user_facebook: 'http://www.facebook.com/james.doe',
				user_twitter: 'http://www.twitter.com/james.doe',
				user_google: 'http://plus.google.com/james.doe',
				user_active: '1',
				user_created: '2014-08-02 00:00:00',
				user_updated: '2014-09-02 00:00:00',
				
			});
			
			model.save(function(error) {
				if(error) {
					callback(error);
					return;
				}
				
				next();		
			}.bind(this));
		})
		.then(function(next) {
			var model = database.model('_user');
			
			model.___construct({
				user_slug: 'janet-doe',
				user_name: 'Janet Doe',
				user_email: 'janet@acme.com',
				user_phone: '+1 (415) 555-2323',
				user_street: '345 Sesame Street',
				user_city: 'Pasig City',
				user_state: 'Metro Manila',
				user_country: 'PH',
				user_postal: '34567',
				user_facebook: 'http://www.facebook.com/janet.doe',
				user_twitter: 'http://www.twitter.com/janet.doe',
				user_google: 'http://plus.google.com/janet.doe',
				user_active: '0',
				user_created: '2014-08-03 00:00:00',
				user_updated: '2014-09-03 00:00:00',
				
			});
			
			model.save(function(error) {
				if(error) {
					callback(error);
					return;
				}
				
				next();		
			}.bind(this));
		})
		.then(function(next) {
			var model = database.model('_user');
			
			model.___construct({
				user_slug: 'jack-doe',
				user_name: 'Jack Doe',
				user_email: 'jack@acme.com',
				user_phone: '+1 (415) 555-2424',
				user_street: '456 Sesame Street',
				user_city: 'Makati City',
				user_state: 'Metro Manila',
				user_country: 'PH',
				user_postal: '45678',
				user_facebook: 'http://www.facebook.com/jack.doe',
				user_twitter: 'http://www.twitter.com/jack.doe',
				user_google: 'http://plus.google.com/jack.doe',
				user_active: '1',
				user_created: '2014-08-04 00:00:00',
				user_updated: '2014-09-04 00:00:00',
				
			});
			
			model.save(function(error) {
				if(error) {
					callback(error);
					return;
				}
				
				next();		
			}.bind(this));
		})
		.then(function(next) {
			var model = database.model('_user');
			
			model.___construct({
				user_slug: 'jill-doe',
				user_name: 'Jill Doe',
				user_email: 'jill@acme.com',
				user_phone: '+1 (415) 555-2525',
				user_street: '567 Sesame Street',
				user_city: 'Quezon City',
				user_state: 'Metro Manila',
				user_country: 'PH',
				user_postal: '56789',
				user_facebook: 'http://www.facebook.com/jill.doe',
				user_twitter: 'http://www.twitter.com/jill.doe',
				user_google: 'http://plus.google.com/jill.doe',
				user_active: '1',
				user_created: '2014-08-05 00:00:00',
				user_updated: '2014-09-05 00:00:00',
				
			});
			
			model.save(function(error) {
				if(error) {
					callback(error);
					return;
				}
				
				next();		
			}.bind(this));
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