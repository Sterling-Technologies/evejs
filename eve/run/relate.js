var copy = {
	'all': [
		'/admin/action/index.js',
		'/admin/event/client-request.js',
		'/admin/event/FROM-create-success.js',
		'/admin/event/NAME-create-error.js',
		'/admin/event/NAME-create-success.js',
		'/admin/event/TO-create-success.js',
		'/admin/factory.js',
		'/admin/index.js',
		'/server/install.js',
		'/server/action/batch.js',
		'/server/action/create.js',
		'/server/action/FROM.js',
		'/server/action/index.js',
		'/server/action/remove.js',
		'/server/action/TO.js',
		'/server/event/NAME-create-error.js',
		'/server/event/NAME-create-success.js',
		'/server/event/NAME-create.js',
		'/server/event/NAME-FROM-list-error.js',
		'/server/event/NAME-FROM-list-success.js',
		'/server/event/NAME-remove-error.js',
		'/server/event/NAME-remove-success.js',
		'/server/event/NAME-remove.js',
		'/server/event/NAME-response.js',
		'/server/event/NAME-TO-list-error.js',
		'/server/event/NAME-TO-list-success.js',
		'/server/event/server-request-end.js',
		'/server/event/server-request-start.js',
		'/server/factory.js',
		'/server/index.js',
		'/web/action/index.js',
		'/web/event/client-request.js',
		'/web/factory.js',
		'/web/index.js' ],
		
	'one-to-one': [
		'/admin/event/FROM-create-output.js',
		'/admin/event/FROM-update-output.js',
		'/admin/event/FROM-update-success.js',
		'/admin/event/TO-create-output.js',
		'/admin/event/TO-update-output.js',
		'/admin/event/TO-update-success.js' ],
		
	'one-to-many': [
		'/admin/action/remove.js',
		'/admin/action/TO.js',
		'/admin/event/body.js',
		'/admin/event/NAME-remove-error.js',
		'/admin/event/NAME-remove-success.js',
		'/admin/event/NAME-remove.js',
		'/admin/event/TO-create-output.js',
		'/admin/event/TO-update-output.js',
		'/admin/event/TO-update-success.js',
		'/admin/template/TO.html' ],
	
	'many-to-one': [
		'/admin/action/FROM.js',
		'/admin/action/remove.js',
		'/admin/event/body.js',
		'/admin/event/FROM-create-output.js',
		'/admin/event/FROM-update-output.js',
		'/admin/event/FROM-update-success.js',
		'/admin/event/NAME-remove-error.js',
		'/admin/event/NAME-remove-success.js',
		'/admin/event/NAME-remove.js',
		'/admin/template/FROM.html' ],
		
	'many-to-many': [
		'/admin/action/FROM.js',
		'/admin/action/remove.js',
		'/admin/action/TO.js',
		'/admin/event/body.js',
		'/admin/event/NAME-remove-error.js',
		'/admin/event/NAME-remove-success.js',
		'/admin/event/NAME-remove.js',
		'/admin/template/FROM.html',
		'/admin/template/TO.html' ]
};


module.exports = function(eve, command) {
	var INVALID_PARAMETER 	= 'Invalid parameter. Must add package name to parse',
		INVALID_PACKAGE 	= 'Invalid parameter. Must add a valid package name to parse',
		INVALID_FROM 		= '"from" package definition is invalid',
		INVALID_TO 			= '"to" package definition is invalid',
		INVALID_FROM_REF 	= '"from.reference" is invalid',
		INVALID_TO_REF		= '"to.reference" is invalid',
		
		wizard 			= require('prompt'),
		handlebars 		= require('../handlebars'),
		package 		= command.shift(), 
		
		root			= eve.getEvePath(),
		settings		= eve.getSettings(),
		build			= eve.getBuildPath(),
		
		path 			= build + '/package/' + package,
		schema 			= path + '/schema.json', 
		templates		= root + '/templates/relation', 
		from 			= build + '/package/[FROM]/schema.json',  
		to 				= build + '/package/[TO]/schema.json', 
		
		environments	= { server: [], admin: [], web: [] },
		types			= ['server', 'admin', 'web'];
	
	//clear cache
	eve.Folder('/').clear();
	
	//validate arguments
	eve.sync(function(next) {
		//is there a package ?
		if(!package || !package.length) {
			this.trigger('error', INVALID_PARAMETER);
			return;
		}
		
		next();
	})
	
	//parse arguments
	.then(function(next) {
		//if the schema is not a file
		if(!this.File(schema).isFile()) {
			this.trigger('error', INVALID_PACKAGE);
			return;
		}
		
		schema = require(schema);
		
		if(typeof schema !== 'object'
		|| typeof schema.from !== 'object'
		|| typeof schema.from.package !== 'string'
		|| typeof schema.from.many !== 'boolean'
		|| typeof schema.from.column !== 'string'
		|| typeof schema.from.reference !== 'string'
		|| typeof schema.to !== 'object'
		|| typeof schema.to.package !== 'string'
		|| typeof schema.to.many !== 'boolean'
		|| typeof schema.to.column !== 'string'
		|| typeof schema.to.reference !== 'string') {
			this.trigger('error', 'Schema format is invalid');
			return;
		}
		
		//populate schema's sub-schemas
		from = from.replace('[FROM]', schema.from.package);
		
		//if the from is not a file
		if(!this.File(from).isFile()) {
			this.trigger('error', INVALID_FROM);
			return;
		} else {
			schema.from.schema = require(from);
		}
		
		//populate schema's sub-schemas
		to = to.replace('[TO]', schema.to.package);
		
		//if the to is not a file
		if(!this.File(to).isFile()) {
			this.trigger('error', INVALID_TO);
			return;
		} else {
			schema.to.schema = require(to);
		}
		
		//validate references
		if(!schema.from.schema.fields[schema.from.reference]) {
			this.trigger('error', INVALID_FROM_REF);
			return;
		}
		
		//validate references
		if(!schema.to.schema.fields[schema.to.reference]) {
			this.trigger('error', INVALID_TO_REF);
			return;
		}
		
		//what is the name?
		if(!schema.name) {
			schema.name = package;
		}
		
		//what is the name?
		if(!schema.from.schema.name) {
			schema.from.schema.name = schema.from.package;
		}
		
		//what is the name?
		if(!schema.to.schema.name) {
			schema.to.schema.name = schema.to.package;
		}
		
		//what is the reference labels ?
		if(!schema.from.referenceLabel) {
			schema.from.referenceLabel = 
				schema.from.schema.fields[schema.from.reference].label 
				|| schema.from.reference;
		}
		
		//what is the reference labels ?
		if(!schema.to.referenceLabel) {
			schema.to.referenceLabel = 
				schema.to.schema.fields[schema.to.reference].label 
				|| schema.to.reference;
		}
		
		//normalize
		schema.to.schema.fields = this.normalize(schema.to.schema.fields, true);
		schema.from.schema.fields = this.normalize(schema.from.schema.fields, true);
		
		//what is the mode
		schema.mode = 'one-to-one';
		if(schema.from.many && schema.to.many) {
			schema.mode = 'many-to-many';
		} else if(!schema.from.many && schema.to.many) {
			schema.mode = 'one-to-many';
		} else if(schema.from.many && !schema.to.many) {
			schema.mode = 'many-to-one';
		}
		
		next();
	})
	
	.then(function(next) {
		this.Folder(path).getFolders(function(error, folders) {
			if(error) {
				this.trigger('error', error);
				return;
			}
			
			if(!folders.length) {
				next();
				return;
			}
			
			var copy = [{
				name 		: 'allow',
				description : 'The relation seems to be already generated ... Generating '
							+ 'this relation will remove all custom changes. Do you want ' 
							+ 'to continue ? (Default: No)',
				type 		: 'string' 
			}];
			
			wizard.get(copy, function(error, result) {
				if(error) {
					this.trigger('error', error);
					return;
				}
				
				if(['y', 'yes'].indexOf(result.allow.toLowerCase()) === -1) {
					this.trigger('error', 'Process has been aborted!');
					return;
				}
				
				next();
			}.bind(this));
		}.bind(this));
	})
	
	//packages are populated, get environemnts
	.then(function(next) {
		var settings = this.getSettings();
		
		//determine environments
		for(var name in settings.environments) {
			if(settings.environments.hasOwnProperty(name)) {
				environments[settings.environments[name].type].push({
					name	: name, 
					settings: settings.environments[name] });
			}
		}
		
		//package and environments are populated, start generating
		next.thread('generate-type', 0);
	})
	
	//start to generate each type
	//on end go to generate-package
	.thread('generate-type', function(i, next) {
		if(i < types.length) {	
			//do we have envronments ?
			if(environments[types[i]].length) {
				var callback = next.thread.bind(null, 'get-files', i);
				this.Folder(templates + '/' + types[i]).getFiles(null, true, callback);
				
				return;
			}
			
			next.thread('generate-type', i + 1);
		}
		
		next();
	})
	
	//start to generate each environment
	.thread('get-files', function(i, error, files, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		next.thread('environment-loop', i, 0, files);
	})
	
	//environment loop
	//on end go to generate-type
	.thread('environment-loop', function(i, j, files, next) {
		if(j < environments[types[i]].length) {
			//where do we put it ?
			//file -> environments
			next.thread('transform-file', i, j, 0, files);
			return;
		}
		
		next.thread('generate-type', i + 1);
	})
	
	//on end goto environment loop
	.thread('transform-file', function(i, j, k, files, next) {
		if(k < files.length) {
			//copy valid files
			if(copy.all.indexOf(files[k].path.substr(templates.length)) === -1
			&& copy[schema.mode].indexOf(files[k].path.substr(templates.length)) === -1) {
				next.thread('transform-file', i, j, k + 1, files);
				return;
			}
			
			//get the data
			files[k].getContent(function(error, content) {
				try {
					content = handlebars.compile(content.toString('utf8'))(schema)
						.replace(/\\\{\s*/g, '{')
						.replace(/\\\}/g, '}');
				} catch(e) {
					this.trigger('error', e, true);
				}
				
				next.thread('copy-file-to-build', i, j, k, files, content);
			}.bind(this));
			
			return;
		}
		
		next.thread('environment-loop', i, j + 1, files);
	})
	
	//start to generate each file to build
	.thread('copy-file-to-build', function(i, j, k, files, content, next) {	
		//what's the detination?
		var root = templates + '/' + types[i];
		
		var destination = this.path(build 
			+ '/package/' + schema.name + '/' 
			+ environments[types[i]][j].name 
			+ files[k].path.substr(root.length));
		
		destination = destination
			.replace('NAME'	, schema.name)
			.replace('FROM'	, schema.from.schema.name)
			.replace('TO'	, schema.to.schema.name);
		
		this.trigger('message', 'Copying to: ' + destination);
		
		var callback = next.thread.bind(
			null, 'copy-next-file', 
			i, j, k, files);
		
		this.File(destination).setContent(content, callback);
	})
	
	//move on to next file to build path
	.thread('copy-next-file', function(i, j, k, files, error, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		next.thread('transform-file', i, j, k + 1, files);
	})
	
	//auto update package settings
	.then(function(next) {
		this.Folder(path).clear().getFolders(function(error, folders) {
			if(error) {
				this.trigger('error', error);
				return;
			}
			
			var environments = [];
			for(var i = 0; i < folders.length; i++) {
				environments.push(folders[i].getName());
			}
			
			//loop through folders
			next.thread('package-environment-loop', 0, environments);
		}.bind(this));
	})
	
	.thread('package-environment-loop', function(i, environments, next) {
		if(i < environments.length) {
			var file = build + '/config/' + environments[i] + '/packages.json';
			
			this.File(file).getData(function(error, data) {
				if(error) {
					this.trigger('error', error);
					return;
				}
				
				next.thread('set-build', i, environments, data);
			}.bind(this));
			
			return;
		}
		
		//next
		next();
	})
	
	.thread('set-build', function(i, environments, data, next) {
		var file = build + '/config/' + environments[i] + '/packages.json';
		
		if(data.indexOf(package) === -1) {
			data.push(package);
		}
		
		this.File(file).setData(data, function(error) {
			if(error) {
				this.trigger('error', error);
				return;
			}
			
			next.thread('package-environment-loop', i + 1, environments);
		}.bind(this));
	})
	
	//we are done
	.then(function(next) {
		eve.trigger('relate-complete', schema, environments);
		next();
	});
};