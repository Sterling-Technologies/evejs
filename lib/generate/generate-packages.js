
var normalizeFields = function(fields) {
	for(var key in fields) {
		if(fields.hasOwnProperty(key)) {
			fields[key] = normalize(fields[key]);
		}
	}
	
	return fields;
};

var normalize = function(field) {
	var normal = { type: field.type || 'string' };
	
	normal.field 	= field.field 	|| ['text'];
	normal.valid 	= field.valid 	|| [];
	normal.label 	= field.label 	|| '';
	normal.holder 	= field.holder 	|| '';
	normal.search 	= field.search 	|| false;
	
	if(field.field === false) {
		normal.field = false;
	} else if(typeof normal.field === 'string') {
		normal.field = [normal.field];
	}
	
	if(typeof normal.valid === 'string') {
		normal.valid = [[normal.valid]];
	}
	
	if(typeof field.default !== 'undefined') {
		normal.default = field.default;
	}
	
	var valid = [];
	
	for(var i = 0; i < normal.valid.length; i++) {
		if(normal.valid[i] instanceof Array) {
			valid.push(normal.valid[i]);
			continue;
		}
		
		valid.push([normal.valid[i]]);
	}
	
	normal.valid = valid;
	
	if(field.options instanceof Array) {
		normal.options = [];
		for(i = 0; i < field.options.length; i++) {
			if(typeof field.options[i] === 'string') {
				normal.options.push({
					value: field.options[i],
					label: field.options[i][0].toUpperCase() + field.options[i].substr(1)
				});
				
				continue;
			}
			
			normal.options.push(field.options[i]);
		}
		
		valid.push(['one', normal.options]);
	}
	
	return normal;
};

module.exports = function(settings, next) {
	var eden		= settings.eden, 
		packages	= settings.packages, 
		config		= settings.config, 
		vendor		= settings.vendor, 
		paths		= settings.paths;
	
	//loop through packages
	eden('array').each(packages, function(i, package) {
		//require the source path
		var schema = require(paths.schema + vendor.name + '/' + package);
		
		schema.fields = normalizeFields(schema.fields);
		
		//going to be forking the sequence
		var sequence2 = eden('sequence');
		
		//get all server files recursively
		sequence2.then(function(next2) {
			eden('folder', paths.generator + 'server').getFiles(null, true, next2);
		});
		
		//copy generator server folders to destination
		sequence2.then(function(files, next2) {
			//old school sequence :D
			var count = 0, done = function() {
				if(++count >= files.length) {
					next2();
				}
			};
			
			eden('array').each(files, function(i, file) {
				//determine the destination
				var root 	= 'build/generator/server/';
				var start 	= file.path.indexOf(root) + root.length;
				var path 	= file.path.substr(start);
				
				var destination = paths.package 
					+ vendor.name + '/' 
					+ package + '/server/' 
					+ path;
					
				var deploy = config.server.path 
					+ '/package/' + vendor.name 
					+ '/' + package 
					+ '/' + path;
	
				require('./generate-package')(settings, schema, file, destination, deploy, done);
			});
		});
		
		//get all control files recursively
		sequence2.then(function(next2) {
			eden('folder', paths.generator + 'control').getFiles(null, true, next2);
		});
		
		//copy generator control folders to destination
		sequence2.then(function(files, next2) {
			//old school sequence :D
			var count = 0, done = function() {
				if(++count >= files.length) {
					next2();
				}
			};
			
			if(schema.use_revision) {
				var noop 		= function() {};
				var file 		= eden('file', paths.generator + 'assets/revision.js');
				
				var destination = paths.package 
					+ vendor.name + '/' + package 
					+ '/control/action/revision.js';
				
				var deploy = config.control.path 
					+ '/application/package/' 
					+ vendor.name + '/' 
					+ package 
					+ '/action/revision.js';
				
				require('./generate-package')(settings, schema, file, destination, deploy, noop);
				
				file 		= eden('file', paths.generator + 'assets/revision.html');
				destination = paths.package + vendor.name + '/' + package + '/control/template/revision.html';
				
				deploy = config.control.path 
					+ '/application/package/' 
					+ vendor.name + '/' 
					+ package 
					+ '/template/revision.html';
				
				require('./generate-package')(settings, schema, file, destination, deploy, noop);
			}
			
			eden('array').each(files, function(i, file) {
				//determine the destination
				var root 	= 'build/generator/control/';
				var start 	= file.path.indexOf(root) + root.length;
				var path 	= file.path.substr(start);
				
				var destination = paths.package 
					+ vendor.name + '/' 
					+ package + '/control/' 
					+ path;
					
				var deploy = config.control.path 
					+ '/application/package/' 
					+ vendor.name + '/' 
					+ package + '/' 
					+ path;
				
				require('./generate-package')(settings, schema, file, destination, deploy, done);
			});
		});
		
		//get all web files recursively
		sequence2.then(function(next2) {
			eden('folder', paths.generator + 'web').getFiles(null, true, next2);
		});
		
		//copy generator control folders to destination
		sequence2.then(function(files) {
			//old school sequence :D
			var count = 0, done = function() {
				if(++count >= files.length) {
					next();
				}
			};
			
			eden('array').each(files, function(i, file) {
				//determine the destination
				var root 	= 'build/generator/web/';
				var start 	= file.path.indexOf(root) + root.length;
				var path 	= file.path.substr(start);
				
				var destination = paths.package 
					+ vendor.name + '/' 
					+ package + '/web/' 
					+ path;
					
				var deploy = config.web.path 
					+ '/application/package/' 
					+ vendor.name + '/' 
					+ package + '/' 
					+ path;
				
				require('./generate-package')(settings, schema, file, destination, deploy, done);
			});
		});
	});
};