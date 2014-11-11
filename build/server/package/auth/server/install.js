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
		database.query('DROP TABLE IF EXISTS `auth`;', next);
	})
	//create
	.then(function(error, rows, meta, next) {
		if(error) {
			callback(error);
			return;
		}
		
		var schema = [];
		schema.push('CREATE TABLE `auth` (');
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
	
	//finish up
	.then(function(error, rows, meta, next) {
		if(error) {
			callback(error);
			return;
		}
		
		callback(null);
		next();
	});
};