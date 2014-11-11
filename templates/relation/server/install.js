module.exports = function(database, fixtures, callback) {
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
		database.query('DROP TABLE IF EXISTS `{{name}}`;', next);
	})
	//create
	.then(function(error, rows, meta, next) {
		if(error) {
			callback(error);
			return;
		}
		
		var schema = [];
		schema.push('CREATE TABLE `{{name}}` (');
		schema.push('`{{from.column}}` int(10) unsigned NOT NULL,');
		schema.push('`{{to.column}}` int(10) unsigned NOT NULL');
		schema.push(') ENGINE=InnoDB DEFAULT CHARSET=latin1;');
			
		database.query(schema.join("\n"), next);
	})
	
	//add primary
	.then(function(error, rows, meta, next) {
		if(error) {
			callback(error);
			return;
		}
		
		database.query('ALTER TABLE `{{name}}` ADD PRIMARY KEY (`{{from.column}}`, `{{to.column}}`);', next);
	})
	
	{{#if fixture~}}
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
	
	{{#loop fixture~}}
	.then(function(next) {
		database.insertRow('{{../name}}', {
			{{#loop value~}}
			{{key}}: '{{value}}',
			{{/loop}}
		}, function(error) {
			if(error) {
				callback(error);
				return;
			}
			
			next();		
		}.bind(this));
	})
	{{/loop~}}
	//finish up
	.then(function(next) {
		callback(null);
	});
	
	{{~else~}}
	//finish up
	.then(function(error, rows, meta, next) {
		if(error) {
			callback(error);
			return;
		}
		
		callback(null);
	});
	{{/if}}
};