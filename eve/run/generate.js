module.exports = function(eve, command) {
	var INVALID_PARAMETER = 'Invalid parameter. Must add package name to parse',
		
		wizard 			= require('prompt'),
		handlebars		= require('../handlebars'),
		
		package 		= command[0], 
		environment 	= command[1], 
		
		root			= eve.getEvePath(),
		settings		= eve.getSettings(),
		build			= eve.getBuildPath(),
		
		path 			= build + '/package/' + package,
		schema 			= path + '/schema.json', 
		templates		= root + '/templates/package', 		
		
		environments	= { server: [], admin: [], web: [], phonegap: [] },
		types			= ['server', 'admin', 'web', 'phonegap'];
	
	//clear cache
	eve.Folder('/').clear();
	
	//validate arguments
	eve
	
	.sync(function(next) {
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
			this.trigger('error', INVALID_PARAMETER);
			return;
		}
		
		schema = require(schema);
		
		//is it relational data?
		if(typeof schema.from === 'object' && typeof schema.to === 'object') {
			require('./relate')(eve, command);
			return;
		}
		
		//what is the name?
		if(!schema.name) {
			schema.name = package;
		}
		
		//normalize
		schema.fields = this.normalize(schema.fields, true);
		
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
				description : 'The package seems to be already generated ... Generating '
							+ 'this package will remove all custom changes. Do you want ' 
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
		//check what environments
		if(environment && settings.environments[environment]) {
			environments = {};
			environments[settings.environments[environment].type] = [];
		}
		
		//determine environments
		for(var name in settings.environments) {
			if(settings.environments.hasOwnProperty(name)) {
				if(environments[settings.environments[name].type] instanceof Array) {
					environments[settings.environments[name].type].push({
						name	: name, 
						settings: settings.environments[name] });
				}
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
			if(environments[types[i]] instanceof Array 
			&& environments[types[i]].length) {
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
			//get the data
			files[k].getContent(function(error, content) {
				if(error) {
					this.trigger('error', error);
					return;
				}
				
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
		var type = templates + '/' + types[i];
		
		var destination = this.getBuildPath() 
			+ '/package/' + package + '/' 
			+ environments[types[i]][j].name 
			+ files[k].path.substr(type.length);
		
		destination = destination.replace('NAME', schema.name);
		
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
		this.trigger('generate-complete', package, environments);
		next();
	});
};