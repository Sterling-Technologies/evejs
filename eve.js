module.exports = require('edenjs').extend(function() {
	/* Require
	-------------------------------*/
	var separator = require('path').sep;
	
	/* Constants
	-------------------------------*/
	/* Public Properties
	-------------------------------*/
	/* Protected Properties
	-------------------------------*/
	this._deploy	= null;
	this._settings 	= null;
	
	/* Private Properties
	-------------------------------*/
	/* Magic
	-------------------------------*/
	/* Public Methods
	-------------------------------*/
	/**
	 * Adds package to package settings
	 *
	 * @param string name
	 * @param callback
	 * @return this
	 */
	this.addPackage = function(name, callback) {
		//what is the build path ?
		var path 		= this.getBuildPath() + '/package/' + name;
		var settings 	= this.getSettings();
		var build		= this.getBuildPath();
		
		this
		
		.sync(function(next) {
			this.Folder(path).getFolders(null, false, next);
		})
		
		.then(function(error, folders, next) {
			if(error) {
				callback(error);
				return;
			}
			
			var environments = [];
			for(var i = 0; i < folders.length; i++) {
				environments.push(folders[i].getName());
			}
			
			//loop through folders
			next.thread('environment-loop', 0, environments);
		})
		
		.thread('environment-loop', function(i, environments, next) {
			if(i < environments.length) {
				var file = build + '/config/' + environments[i] + '/packages.json';
				
				this.File(file).getData(function(error, data) {
					if(error) {
						callback(error, null);
						return;
					}
					
					next.thread('set-build', i, environments, data);
				});
				
				return;
			}
			
			//next
			next();
		})
		
		.thread('set-build', function(i, environments, data, next) {
			var file = build + '/config/' + environments[i] + '/packages.json';
			
			if(data.indexOf(name) === -1) {
				data.push(name);
			}
			
			this.File(file).setData(data, function(error) {
				if(error) {
					callback(error);
					return;
				}
				
				var deploy = settings.environments[environments[i]].path;
				
				//if destination starts with a .
				if(deploy.indexOf('.') === 0) {
					//destination is relative to local
					deploy = build + deploy.substr(1);
				}
				
				if(settings.environments[environments[i]].type !== 'server') {
					deploy += '/application';
				}
				
				var file = deploy + '/config/packages.json';
				
				this.File(file).getData(function(error, data) {
					if(error) {
						callback(error);
						return;
					}
					
					next.thread('set-deploy', i, environments, data);
				});
			}.bind(this));
		})
		
		.thread('set-deploy', function(i, environments, data, next) {
			var deploy = settings.environments[environments[i]].path;
			
			//if destination starts with a .
			if(deploy.indexOf('.') === 0) {
				//destination is relative to local
				deploy = build + deploy.substr(1);
			}
			
			if(settings.environments[environments[i]].type !== 'server') {
				deploy += '/application';
			}
			
			var file = deploy + '/config/packages.json';
			
			if(data.indexOf(name) === -1) {
				data.push(name);
			}
			
			this.File(file).setData(data, function(error) {
				if(error) {
					callback(error);
					return;
				}
				
				next.thread('environment-loop', i + 1, environments);
			})
		})
		
		.then(function(next) {
			callback(null);
		});
		
		return this;
	};
	
	/**
	 * Default callback just for processing errors
	 *
	 * @return this
	 */
	this.error = function(error) {
		if (error) {
			this.trigger('error', error);
		}
		
		return this;
	};
	
	/**
	 * Returns eve path
	 *
	 * @return string
	 */
	this.getEvePath = function(root) {
		return __dirname;
	};
	
	/**
	 * Returns build path
	 *
	 * @return string
	 */
	this.getBuildPath = function() {
		return process.env.PWD || process.cwd();
	};
	
	/**
	 * Returns a database config
	 *
	 * @param string
	 * @return object
	 */
	this.getDatabase = function(key) {
		var settings = this.getSettings();
		if(key && settings.databases[key]) {
			return settings.databases[key];
		}
		
		//find the first default one
		for(key in settings.databases) {
			if(settings.databases.hasOwnProperty(key)) {
				if(settings.databases[key].default) {
					return settings.databases[key];
				}
			}
		}
		
		//um return the first one?
		for(key in settings.databases) {
			return settings.databases[key];
		}
	};
	
	/**
	 * Returns the deploy path
	 *
	 * @return string
	 */
	this.getDeployPath = function() {
		return this._deploy;
	};
	
	/**
	 * Returns the project settings in build.json
	 *
	 * @return object
	 */
	this.getSettings = function() {
		if(this._settings === null
		&& this.File(this.getBuildPath() + '/build.json').isFile()) {
			this._settings = require(this.getBuildPath() + '/build.json') || null;
		}
		
		return this._settings || { databases: {
			eve : {
				type	: 'mysql',
				host	: '127.0.0.1',
				port	: null,
				name	: 'eve',
				user	: 'root',
				pass	: '',
				default	: true
			}
		}, environments: {} };
	};
	
	/**
	 * Normalizes generated fields
	 *
	 * @param object schema
	 * @param bool true if a list of fields vs just one field
	 * @return object normalized schema
	 */
	this.normalize = function(field, fields) {
		if(fields) {
			for(var key in field) {
				if(field.hasOwnProperty(key)) {
					field[key] = this.normalize(field[key]);
				}
			}
			
			return field;
		}
		
		var normal = { type: field.type || 'string' };
		
		normal.field 	= field.field 	|| ['text'];
		normal.valid 	= field.valid 	|| [];
		normal.label 	= field.label 	|| '';
		normal.holder 	= field.holder 	|| '';
		normal.search 	= field.search 	|| false;
		
		if(field.type === 'file') {
			normal.field = 'file';
			normal.multiple = field.multiple || false;
		}
		
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
		
		if(normal.default === null || normal.default === 'NULL') {
			normal.default = 'NULL'
		} else if(normal.type === 'int' && typeof normal.default !== 'undefined') {
			normal.default = parseInt(normal.default) || '0';
			normal.default += '';
		} else if(normal.type === 'float' && typeof normal.default !== 'undefined') {
			normal.default = parseFloat(normal.default) || '0.00';
			normal.default += '';
		} else if(normal.type === 'boolean' && typeof normal.default !== 'undefined') {
			normal.default = !!normal.default ? '1': '0';
		} else if(normal.type === 'datetime' 
		&& (normal.default === 'now' 
		|| normal.default === 'now()'
		|| normal.default === 'CURRENT_TIMESTAMP')) {
			normal.default = 'CURRENT_TIMESTAMP';
		} else if(typeof normal.default === 'string') {
			normal.default = "'" + normal.default + "'";
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
			
			if(normal.type !== 'file') {
				valid.push(['one', normal.options]);
			}
		}
		
		if(normal.field === false) {
			normal.valid = [];
		}
		
		return normal;
	};
	
	/**
	 * Fixes path
	 *
	 * @param string
	 * @return string
	 */
	this.path = function(path) {
		return path.replace(/\//g, separator);
	};
	
	/**
	 * Sets the current deploy path
	 *
	 * @param string
	 * @return this
	 */
	this.setDeployPath = function(path) {
		this._deploy = this.path(path);
		
		//if destination starts with a .
		if(this._deploy.indexOf('.') === 0) {
			//destination is relative to local
			this._deploy = this.getBuildPath() + this._deploy.substr(1);
		}
		
		return this;
	};
	
	/**
	 * Updates each environment settings
	 *
	 * @param function
	 * @return this
	 */
	this.setEnvironments = function(callback) {
		var file, settings = this.getSettings();
		
		var sync = this.sync()
		
		.thread('add-to-build', function(name, next) {
			var file = this.getBuildPath() + this.path('/config/' + name + '/settings.json');
			
			//get the settings data
			this.File(file).getData(function(error, data) {
				if(error) {
					callback(error);
					return;
				}
				
				next.thread('set-to-build', file, name, data);
			}.bind(this));
		})
		
		.thread('set-to-build', function(file, name, data, next) {
			//loop the environments
			//to determine the data.environments
			for(var environment in settings.environments) {
				if(settings.environments.hasOwnProperty(environment)) {
					//if the environment is already set
					if(typeof data.environments[environment] === 'object') {
						//dont tamper with it
						continue;
					}
					
					//clear to add it
					data.environments[environment] =  { 
						type: settings.environments[environment].type, 
						protocol: 'http', 
						host: environment + '.eve.dev', 
						port: 8082 };	
					
					//determine the default server	
					if(settings.environments[environment].type !== 'server' 
					&& !data.server 
					&& data.environments[environment].type === 'server') {
						data.server = environment;
					}
				}
			}
			
			//now save it
			this.File(file).setData(data, function(error) {
				if(error) {
					callback(error);
					return;
				}
				
				next.thread('add-to-deploy', name);
			});
		})
		
		.thread('add-to-deploy', function(name, next) {
			var deploy = settings.environments[name].path;
			
			//if destination starts with a .
			if(deploy.indexOf('.') === 0) {
				//destination is relative to local
				deploy = this.getBuildPath() + deploy.substr(1);
			}
			
			var file = deploy + this.path('/config/settings.json');
			
			if(settings.environments[name].type !== 'server') {
				file = deploy + this.path('/application/config/settings.json');
			}
			
			//get the settings data
			this.File(file).getData(function(error, data) {
				if(error) {
					callback(error);
					return;
				}
				
				next.thread('set-to-deploy', file, name, data);
			}.bind(this));
		})
		
		.thread('set-to-deploy', function(file, name, data, next) {
			//loop the environments
			//to determine the data.environments
			for(var environment in settings.environments) {
				if(settings.environments.hasOwnProperty(environment)) {
					//if the environment is already set
					if(typeof data.environments[environment] === 'object') {
						//dont tamper with it
						continue;
					}
					
					//clear to add it
					data.environments[environment] =  { 
						type: settings.environments[environment].type, 
						protocol: 'http', 
						host: environment + '.eve.dev', 
						port: 8082 };	
					
					//determine the default server	
					if(settings.environments[environment].type !== 'server' 
					&& !data.server 
					&& data.environments[environment].type === 'server') {
						data.server = environment;
					}
				}
			}
			
			//now save it
			this.File(file).setData(data, function(error) {
				if(error) {
					callback(error);
					return;
				}
				
				next();
			});
		});
		
		for(var environment in settings.environments) {
			if(settings.environments.hasOwnProperty(environment)) {
				sync.then(function(environment, next) {
					next.thread('add-to-build', environment);
				}.bind(null, environment));
			}
		}
		
		sync.then(function(next) {
			callback(null);
		});
		
		return this;
	};
	
	/**
	 * Sets settings into local build.json
	 *
	 * @param object
	 * @param function
	 * @return this
	 */
	this.setSettings = function(settings, callback) {
		this._settings = settings;
		
		this.File(this.getBuildPath() + '/build.json').setData(settings, callback);
		return this;
	};
	
	/**
	 * Runs a command if it is an actual command
	 *
	 * @param string
	 * @return this
	 */
	this.run = function(command) {
		//default command is "eve watch"
		action 	= command.shift() || 'watch';
		
		//just let the files be responsible for the actions if it exists
		
		//first check for the file
		var script = __dirname + '/eve/run/' + action + '.js';
		
		//if script is not a file
		if(!this.File(script).isFile()) {
			//give an error and return
			this.trigger('error', 'This is not a valid command');
			return;
		}
		
		this.trigger(action, command);
		
		//require the file and let it do the rest
		require(script)(this, command);
		
		return this;
	};
	
	/* Protected Methods
	-------------------------------*/
	/* Private Methods
	-------------------------------*/
}).register('eve').singleton();