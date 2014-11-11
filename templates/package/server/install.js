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
		schema.push('`{{primary}}` int(10) unsigned NOT NULL,');
		{{#if slug~}}
		schema.push('`{{slug.[0]}}` varchar(255) NOT NULL,');
		{{/if~}}
		{{#loop fields~}}
		{{#when value.type '==' 'int'~}}
		schema.push("`{{../key}}` int(10) {{#if ../value.default~}}
			NOT NULL DEFAULT {{{../value.default}}}
			{{~else~}}
			DEFAULT NULL
			{{~/if~}},");
		{{/when~}}
		{{#when value.type '==' 'float'~}}
		schema.push("`{{../key}}` float(10,2) {{#if ../value.default~}}
			NOT NULL DEFAULT {{{../value.default}}}
			{{~else~}}
			DEFAULT NULL
			{{~/if~}},");
		{{/when~}}
		{{#when value.type '==' 'string'~}}
		schema.push("`{{../key}}` varchar(255) {{#if ../value.default~}}
			NOT NULL DEFAULT {{{../value.default}}}
			{{~else~}}
			DEFAULT NULL
			{{~/if~}},");
		{{/when~}}
		{{#when value.type '==' 'text'~}}
		schema.push("`{{../key}}` text {{#if ../value.default~}}
			NOT NULL DEFAULT {{{../value.default}}}
			{{~else~}}
			DEFAULT NULL
			{{~/if~}},");
		{{/when~}}
		{{#when value.type '==' 'boolean'~}}
		schema.push("`{{../key}}` int(1) unsigned {{#if ../value.default~}}
			NOT NULL DEFAULT {{{../value.default}}}
			{{~else~}}
			DEFAULT NULL
			{{~/if~}},");
		{{/when~}}
		{{#when value.type '==' 'date'~}}
		schema.push("`{{../key}}` date {{#if ../value.default~}}
			NOT NULL DEFAULT {{{../value.default}}}
			{{~else~}}
			DEFAULT NULL
			{{~/if~}},");
		{{/when~}}
		{{#when value.type '==' 'datetime'~}}
		schema.push("`{{../key}}` datetime {{#if ../value.default~}}
			NOT NULL DEFAULT {{{../value.default}}}
			{{~else~}}
			DEFAULT NULL
			{{~/if~}},");
		{{/when~}}
		{{#when value.type '==' 'time'~}}
		schema.push("`{{../key}}` time {{#if ../value.default~}}
			NOT NULL DEFAULT {{{../value.default}}}
			{{~else~}}
			DEFAULT NULL
			{{~/if~}},");
		{{/when~}}
		{{/loop~}}
		
		{{#if active~}}
		schema.push('`{{active}}` int(1) unsigned NOT NULL DEFAULT \'1\',');
		{{/if~}}
		
		{{#if created~}}
		schema.push('`{{created}}` datetime NOT NULL,');
		{{/if~}}
		
		{{#if updated~}}
		schema.push('`{{updated}}` datetime NOT NULL,');
		{{/if}}
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
		
		database.query('ALTER TABLE `{{name}}` ADD PRIMARY KEY (`{{primary}}`);', next);
	})
	
	{{#if slug~}}
	//add slug
	.then(function(error, rows, meta, next) {
		if(error) {
			callback(error);
			return;
		}
		
		database.query('ALTER TABLE `{{name}}` ADD UNIQUE KEY `{{slug.[0]}}` (`{{slug.[0]}}`);', next);
	})
	{{/if~}}
	
	//add auto increment
	.then(function(error, rows, meta, next) {
		if(error) {
			callback(error);
			return;
		}
		
		database.query('ALTER TABLE `{{name}}` MODIFY `{{primary}}` int(10) unsigned NOT NULL AUTO_INCREMENT;', 
		next);
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
		var model = database.model('{{../name}}');
		
		model.___construct({
			{{#loop value~}}
			{{key}}: '{{value}}',
			{{/loop}}
		});
		
		model.save(function(error) {
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