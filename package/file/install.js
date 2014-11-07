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
		schema.push('`file_created` datetime NOT NULL,');
		
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
		next();
	});
};