module.exports = function(database, callback) {
	var eden = require('edenjs');
	
	database = eden().Mysql(
		database.host, 
		database.port, 
		database.name,
		database.user,
		database.pass);
	
	eden()
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
		schema.push("`user_password` varchar(255) DEFAULT NULL,");
		schema.push("`user_phone` varchar(255) DEFAULT NULL,");
		schema.push("`user_street` varchar(255) DEFAULT NULL,");
		schema.push("`user_city` varchar(255) DEFAULT NULL,");
		schema.push("`user_state` varchar(255) DEFAULT NULL,");
		schema.push("`user_country` varchar(255) DEFAULT NULL,");
		schema.push("`user_postal` varchar(255) DEFAULT NULL,");
		schema.push("`user_facebook` varchar(255) DEFAULT NULL,");
		schema.push("`user_twitter` varchar(255) DEFAULT NULL,");
		schema.push("`user_google` varchar(255) DEFAULT NULL,");
		schema.push('`user_active` int(1) unsigned NOT NULL DEFAULT \'1\',');
		schema.push('`user_created` datetime NOT NULL,');
		schema.push('`user_updated` datetime NOT NULL,');
		
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
		
		next();
	})
	
	.then(function(next) {
		var model = database.model('user');
		
		model.___construct({
			user_slug: 'jane-doe',
			user_name: 'Jane Doe',
			user_email: 'jane@acme.com',
			user_phone: '+1 (415) 555-2121',
			user_password: '202cb962ac59075b964b07152d234b70',
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
		var model = database.model('user');
		
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
		var model = database.model('user');
		
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
		var model = database.model('user');
		
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
		var model = database.model('user');
		
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
		next();
	});
};