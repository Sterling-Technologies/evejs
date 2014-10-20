module.exports = function(eve, command) {
	var handlebars		= require('../handlebars');
		package 		= command.shift(), 
		schema 			= null, 
		environments	= {
			server	: [],
			admin	: [],
			web		: [] },
		types			= ['server', 'admin', 'web'];
	
	//validate arguments
	eve.sync(function(next) {
		//is there a package ?
		if(!package || !package.length) {
			this.trigger('error', 'Invalid parameter. Must add package name to parse');
			return;
		}
		
		next();
	})
	
	//parse arguments
	.then(function(next) {
		schema = this.File(this.getBuildPath() + '/package/' + package + '/schema.json');
		
		//if the schema is not a file
		if(!schema.isFile()) {
			this.trigger('error', 'Invalid parameter. Must add a valid package name to parse');
			return;
		}
		
		schema = require(this.getBuildPath() + '/package/' + package + '/schema.json');
		
		//what is the name?
		if(!schema.name) {
			schema.name = package;
		}
		
		//normalize
		schema.fields = this.normalize(schema.fields, true);
		
		//is there a file?
		for(var name in schema.fields) {
			if(schema.fields.hasOwnProperty(name)) {
				if(schema.fields[name].type === 'file') {
					schema.files = true;
					break;
				}
			}
		}
		
		next();
	})
	
	//packages are populated, get environemnts
	.then(function(next) {
		var settings = this.getSettings();
		
		//determine environments
		for(var name in settings) {
			if(settings.hasOwnProperty(name)) {
				environments[settings[name].type].push({
					name	: name, 
					settings: settings[name] });
			}
		}
		
		//package and environments are populated, start generating
		next();
	})
	
	//select database
	.then(function(next) {
		//where to put it?
		//get the database file from the build
		var database, databases = require(this.getBuildPath() + '/config/server/databases.js');
		
		for(var key in databases) {
			if(databases.hasOwnProperty(key)) {
				if(databases[key].default) {
					database = databases[key];
				}
			}
		}
		
		if(database) {
			this
				.trigger('message', 'Installing schema ...')
				.Mysql(
					database.host, 
					database.port, 
					'',
					database.user,
					database.pass)
				.query('CREATE DATABASE IF NOT EXISTS `'+database.name+'`;', function(error, rows, meta) {
					if(error) {
						this.trigger('error', error);
						return;
					}
					
					database = this
					.Mysql(
						database.host, 
						database.port, 
						database.name,
						database.user,
						database.pass);
						
					next.thread('drop', database);
				}.bind(this));
			return;
		}
		
		this.trigger('error', 'No database found. Check your server config for databases.js');
		return;
	})
	
	.thread('drop', function(database, next) {
		var callback = next.thread.bind(null, 'schema', database);
		
		database.query('DROP TABLE IF EXISTS `' + schema.name + '`;', callback);
	})
	
	.thread('schema', function(database, error, rows, meta, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		//build the schema
		var defaults, query = [];
		query.push('CREATE TABLE `' + schema.name + '` (');
		query.push('`'+schema.primary+'` int(10) unsigned NOT NULL,');
		
		if(schema.slug instanceof Array 
		&& typeof schema.slug[0] === 'string' 
		&& schema.slug[0].length) {
			query.push('`'+schema.slug[0]+'` varchar(255) NOT NULL,');
		}
		
		for(var name in schema.fields) {
			if(schema.fields.hasOwnProperty(name)) {
				if(typeof schema.fields[name].default === 'undefined') {
					defaults = 'DEFAULT NULL';
				} else {
					defaults = 'NOT NULL DEFAULT ' + schema.fields[name].default;
				}
				
				switch(schema.fields[name].type) {
					case 'int':
						query.push('`'+name+'` int(10) ' + defaults + ',');
						break;
					case 'float':
						query.push('`'+name+'` float(10,2) ' + defaults + ',');
						break;
					case 'file':
					case 'string':
						query.push('`'+name+'` varchar(255) ' + defaults + ',');
						break;
					case 'text':
						query.push('`'+name+'` text ' + defaults + ',');
						break;
					case 'boolean':
						query.push('`'+name+'` int(1) unsigned ' + defaults + ',');
						break;
					case 'date':
						query.push('`'+name+'` date ' + defaults + ',');
						break;
					case 'datetime':
						query.push('`'+name+'` datetime ' + defaults + ',');
						break;
					case 'time':
						query.push('`'+name+'` time ' + defaults + ',');
						break;
				}
			}
		}
		
		if(typeof schema.active === 'string' && schema.active.length) {
			query.push('`'+schema.active+'` int(1) unsigned NOT NULL DEFAULT \'1\',');
		}
		
		if(typeof schema.created === 'string' && schema.created.length) {
			query.push('`'+schema.created+'` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,');
		}
		
		if(typeof schema.updated === 'string' && schema.updated.length) {
			query.push('`'+schema.updated+'` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,');
		}
		
		query[query.length - 1] = query[query.length - 1].substr(0, query[query.length - 1].length - 1);
		
		query.push(') ENGINE=InnoDB DEFAULT CHARSET=latin1;');
		
		var callback = next.thread.bind(null, 'primary-key', database);
		
		database.query(query.join("\n"), callback);
	})
	
	.thread('primary-key', function(database, error, rows, meta, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		var callback = next.thread.bind(null, 'auto-increment', database);
		
		if(schema.slug instanceof Array 
		&& typeof schema.slug[0] === 'string' 
		&& schema.slug[0].length) {
			callback = next.thread.bind(null, 'add-slug', database);
		}
		
		
		database.query('ALTER TABLE `' + schema.name + '` ADD PRIMARY KEY (`' + schema.primary + '`);', 
		callback);
	})
	
	.thread('add-slug', function(database, error, rows, meta, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		var callback = next.thread.bind(null, 'auto-increment', database);
		database.query('ALTER TABLE `' + schema.name + '` ADD UNIQUE KEY `'+ schema.slug[0]
		+'` (`' + schema.slug[0] + '`);', callback);
	})
	
	.thread('auto-increment', function(database, error, rows, meta, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		var callback = next.thread.bind(null, 'fixture', database);
		database.query('ALTER TABLE `' + schema.name + '` MODIFY `'+schema.primary
			+'` int(10) unsigned NOT NULL AUTO_INCREMENT;', 
			callback);
	})
	
	.thread('fixture', function(database, error, rows, meta, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		if(schema.fixture instanceof Array) {
			next.thread('fixture-item', 0, database);
			return;
		}
		
		next.thread('generate-type', 0);
	})
	
	.thread('fixture-item', function(i, database, next) {
		if(i < schema.fixture.length) {
			var model = database.model(schema.name);
			
			model.___construct(schema.fixture[i]);
			
			model.save(function(error) {
				if(error) {
					this.trigger('error', error);
					return;
				}
				
				next.thread('fixture-item', i + 1, database);		
			}.bind(this));
			
			return;
		}
		
		next.thread('generate-type', 0);
	})
	
	//start to generate each type
	//on end go to generate-package
	.thread('generate-type', function(i, next) {
		if(i < types.length) {	
			//do we have envronments ?
			if(environments[types[i]].length) {
				var callback = next.thread.bind(null, 'get-files', i);
				this.Folder(this.getEvePath() + '/generate/' + types[i]).getFiles(null, true, callback);
				
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
				try {
					content = handlebars.compile(content.toString('utf8'))(schema)
						.replace(/\\\{\s*/g, '{')
						.replace(/\\\}/g, '}');
				} catch(e) {
					eve.trigger('error', e);
				}
				
				next.thread('copy-file-to-build', i, j, k, files, content);
			});
			
			return;
		}
		
		next.thread('environment-loop', i, j + 1, files);
	})
	
	//start to generate each file to build
	.thread('copy-file-to-build', function(i, j, k, files, content, next) {	
		//what's the detination?
		var root = this.getEvePath() + '/generate/' + types[i];
		
		var destination = this.path(this.getBuildPath() 
			+ '/package/' + package + '/' 
			+ environments[types[i]][j].name 
			+ files[k].path.substr(root.length));
		
		destination = destination.replace('SLUG', schema.name);
		
		this.trigger('message', 'Copying to: ' + destination);
		
		var callback = next.thread.bind(
			null, 'copy-file-to-deploy', 
			i, j, k, files, content);
		
		this.File(destination).setContent(content, callback);
	})
	
	//start to generate each file to deploy
	.thread('copy-file-to-deploy', function(i, j, k, files, content, error, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		//what's the detination?
		var root = this.getEvePath() + '/generate/' + types[i];
		
		var extra = '';
		
		if(environments[types[i]][j].settings.type === 'admin'
		|| environments[types[i]][j].settings.type === 'web') {
			extra = '/application';	
		}
		
		//set the deploy path
		this.setDeployPath(environments[types[i]][j].settings.path);
		
		var destination = this.path(this.getDeployPath() 
			+ extra + '/package/' + package
			+ files[k].path.substr(root.length));
		
		destination = destination.replace('SLUG', schema.name);
		
		this.trigger('message', 'Copying to: ' + destination);
		
		var callback = next.thread.bind(
			null, 'copy-next-file', i, j, k, files);
			
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
	//make map files
	.then(function(next) {
		next.thread('make-map-admin', 0);
	})
	.thread('make-map-admin', function(i, next) {
		if(i < environments.admin.length) {
			//get the deploy path
			var deploy = this
				.setDeployPath(environments.admin[i].settings.path)
				.getDeployPath();
			
			//get all the files in the deploy path
			this.Folder(deploy + '/application').getFiles(null, true, function(error, files) {
				//if there's an error
				if(error) {
					this.trigger('error', error);
					next.thread('make-map-admin', i + 1);
					//do nothing
					return;
				}
				
				//add files to the map
				for(var map = [], i = 0; i < files.length; i++) {
					map.push(files[i].path.substr(deploy.length));
				}
				
				//set the map
				this.File(deploy + '/application/map.js').setContent('jQuery.eve.map = '+JSON.stringify(map)+';', 
				function(error) {
					if(error) {
						this.trigger('error', error);
					}
					
					next.thread('make-map-admin', i + 1);
				}.bind(this));
			}.bind(this));
			
			return;
		}
		
		next.thread('make-map-web', 0);
	})
	
	.thread('make-map-web', function(i, next) {
		
		if(i < environments.web.length) {
			//get the deploy path
			var deploy = this
				.setDeployPath(environments.web[i].settings.path)
				.getDeployPath();
			
			//get all the files in the deploy path
			this.Folder(deploy + '/application').getFiles(null, true, function(error, files) {
				//if there's an error
				if(error) {
					//do nothing
					this.trigger('error', error);
					next.thread('make-map-web', i + 1);
					return;
				}
				
				//add files to the map
				for(var map = [], i = 0; i < files.length; i++) {
					map.push(files[i].path.substr(deploy.length));
				}
				
				//set the map
				this.File(deploy + '/application/map.js').setContent('jQuery.eve.map = '+JSON.stringify(map)+';', 
				function(error) {
					if(error) {
						this.trigger('error', error);
					}
					
					next.thread('make-map-web', i + 1);
				}.bind(this));
			}.bind(this));
			
			return;
		}
		
		next();
	})
	//we are done
	.then(function(next) {
		eve.trigger('generate-complete', package, environments);
		next();
	});
};