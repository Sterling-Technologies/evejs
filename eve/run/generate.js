module.exports = function(eve, command) {
	var handlebars		= require('../handlebars');
		package 		= command.shift(), 
		packages 		= [], 
		environments	= {
			server	: [],
			admin	: [],
			web		: [] },
		types			= ['server', 'admin', 'web'];
	
	//validate arguments
	eve.sync(function(next) {
		//is there a package ?
		if(!package || !package.length) {
			this.trigger('error', 'Invalid parameter. Must be in the form of vendor or vendor/package');
			return;
		}
		
		//is the schema valid ?
		if(package.split('/').length > 2) {
			this.trigger('error', 'Invalid parameter. Must be in the form of vendor or vendor/package');
			return;
		}
		
		next();
	})
	
	//parse arguments
	.then(function(next) {
		var schema = this.File(this.getBuildPath() + '/package/' + package + '/schema.json');
	
		//is there a schema ?
		if(package.split('/').length === 2) {
			
			if(!schema.isFile()) {
				this.trigger('error', schema + ' does not exist.');
				return;
			}
			
			packages = [package];
			
			next();
			
			return;
		}
		
		var vendor = this.Folder(this.getBuildPath() + '/package/' + package);
		
		//is it a folder ?
		if(!vendor.isFolder()) {
			this.trigger('error', 'Invalid parameter. Must be in the form of vendor or vendor/package');
			return;
		}
		
		var callback = next.thread.bind(null, 'get-packages');
		vendor.getFolders(null, false, callback);
	})
	
	//parse packages for schema files
	.thread('get-packages', function(error, folders, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		for(var schema, i = 0; i < folders.length; i++) {
			schema = this.File(folders[i].path + '/schema.json');
			if(schema.isFile()) {
				packages.push(package + '/' + folders[i].getName());
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
		
		//packages and environments are populated, start generating
		next.thread('generate-package', 0);
	})
	
	//start to generate each package
	.thread('generate-package', function(i, next) {
		if(i < packages.length) {
			next.thread('database', i);
			return;
		}
		
		next();
	})
	
	.thread('database', function(i, next) {
		//get the data
		var data = require(this.getBuildPath() + '/package/' + packages[i] + '/schema.json');
		//what is the vendor?
		data.vendor = packages[i].split('/')[0];
		//what is the name?
		if(!data.name) {
			data.name = packages[i].split('/')[1];
		}
		
		//normalize
		data.fields = this.normalize(data.fields, true);
		
		//is there a file?
		for(var name in data.fields) {
			if(data.fields.hasOwnProperty(name)) {
				if(data.fields[name].type === 'file') {
					data.files = true;
					break;
				}
			}
		}
		
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
						
					next.thread('drop', i, database, data);
				}.bind(this));
			return;
		}
		
		this.trigger('error', 'No database found. Check your server config for databases.js');
		next.thread('generate-type', i, 0);
	})
	
	.thread('drop', function(i, database, data, next) {
		var callback = next.thread.bind(null, 'schema', i, database, data);
		
		database.query('DROP TABLE IF EXISTS `'+data.name+'`;', callback);
	})
	
	.thread('schema', function(i, database, data, error, rows, meta, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		//build the schema
		var schema = [];
		schema.push('CREATE TABLE `'+data.name+'` (');
		schema.push('`'+data.primary+'` int(10) unsigned NOT NULL,');
		
		if(data.slug instanceof Array 
		&& typeof data.slug[0] === 'string' 
		&& data.slug[0].length) {
			schema.push('`'+data.slug[0]+'` varchar(255) NOT NULL,');
		}
		
		for(var name in data.fields) {
			if(data.fields.hasOwnProperty(name)) {
				switch(data.fields[name].type) {
					case 'int':
						schema.push('`'+name+'` int(10) DEFAULT 0,');
						break;
					case 'float':
						schema.push('`'+name+'` float(10,2) DEFAULT 0.00,');
						break;
					case 'file':
					case 'string':
						schema.push('`'+name+'` varchar(255) DEFAULT NULL,');
						break;
					case 'text':
						schema.push('`'+name+'` text DEFAULT NULL,');
						break;
					case 'boolean':
						schema.push('`'+name+'` int(1) unsigned NOT NULL DEFAULT \'1\',');
						break;
					case 'date':
						schema.push('`'+name+'` date NOT NULL,');
						break;
					case 'datetime':
						schema.push('`'+name+'` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,');
						break;
					case 'time':
						schema.push('`'+name+'` time NOT NULL,');
						break;
				}
			}
		}
		
		if(typeof data.active === 'string' && data.active.length) {
			schema.push('`'+data.active+'` int(1) unsigned NOT NULL DEFAULT \'1\',');
		}
		
		if(typeof data.created === 'string' && data.created.length) {
			schema.push('`'+data.created+'` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,');
		}
		
		if(typeof data.updated === 'string' && data.updated.length) {
			schema.push('`'+data.updated+'` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,');
		}
		
		schema[schema.length - 1] = schema[schema.length - 1].substr(0, schema[schema.length - 1].length - 1);
		
		schema.push(') ENGINE=InnoDB DEFAULT CHARSET=latin1;');
		
		var callback = next.thread.bind(null, 'primary-key', i, database, data);
			
		database.query(schema.join("\n"), callback);
	})
	
	.thread('primary-key', function(i, database, data, error, rows, meta, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		var callback = next.thread.bind(null, 'auto-increment', i, database, data);
		
		if(data.slug instanceof Array 
		&& typeof data.slug[0] === 'string' 
		&& data.slug[0].length) {
			callback = next.thread.bind(null, 'add-slug', i, database, data);
		}
		
		
		database.query('ALTER TABLE `'+data.name
			+'` ADD PRIMARY KEY (`'+data.primary+'`);', 
			callback);
	})
	
	.thread('add-slug', function(i, database, data, error, rows, meta, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		var callback = next.thread.bind(null, 'auto-increment', i, database, data);
		
		database.query('ALTER TABLE `'+data.name
			+'` ADD UNIQUE KEY `'+data.slug[0]
			+'` (`'+data.slug[0]+'`);', 
			callback);
	})
	
	.thread('auto-increment', function(i, database, data, error, rows, meta, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		var callback = next.thread.bind(null, 'fixture', i, database, data);
		
		database.query('ALTER TABLE `'+data.name
			+'` MODIFY `'+data.primary
			+'` int(10) unsigned NOT NULL AUTO_INCREMENT;', 
			callback);
	})
	
	.thread('fixture', function(i, database, data, error, rows, meta, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		if(data.fixture instanceof Array) {
			next.thread('fixture-item', i, 0, database, data);
			return;
		}
		
		next.thread('generate-type', i, 0);
	})
	
	.thread('fixture-item', function(i, j, database, data, next) {
		if(j < data.fixture.length) {
			var model = database.model(data.name);
			
			model.___construct(data.fixture[j]);
			
			model.save(function(error) {
				if(error) {
					this.trigger('error', error);
					return;
				}
				
				next.thread('fixture-item', i, j + 1, database, data);		
			}.bind(this));
			
			return
		}
		
		next.thread('generate-type', i, 0);
	})
	
	//start to generate each type
	//on end go to generate-package
	.thread('generate-type', function(i, j, next) {
		if(j < types.length) {	
			//do we have envronments ?
			if(environments[types[j]].length) {
				var callback = next.thread.bind(null, 'get-files', i, j);
				this.Folder(this.getEvePath() + '/generate/' + types[j]).getFiles(null, true, callback);
				
				return;
			}
			
			next.thread('generate-type', i, j + 1);
		}
		
		next.thread('generate-package', i + 1);
	})
	
	//start to generate each environment
	.thread('get-files', function(i, j, error, files, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		next.thread('environment-loop', i, j, 0, files);
	})
	
	//environment loop
	//on end go to generate-type
	.thread('environment-loop', function(i, j, k, files, next) {
		if(k < environments[types[j]].length) {
			//where do we put it ?
			//file -> environments
			next.thread('transform-file', i, j, k, 0, files);
			return;
		}
		
		next.thread('generate-type', i, j + 1);
	})
	
	//on end goto environment loop
	.thread('transform-file', function(i, j, k, l, files, next) {
		if(l < files.length) {
			//get the data
			var data = require(this.getBuildPath() + '/package/' + packages[i] + '/schema.json');

			files[l].getContent(function(error, content) {
				try {
					content = handlebars.compile(content.toString('utf8'))(data)
						.replace(/\\\{\s*/g, '{')
						.replace(/\\\}/g, '}');
				} catch(e) {
					eve.trigger('error', e);
				}
				
				next.thread('copy-file-to-build', i, j, k, l, files, content, data);
			});
			
			return;
		}
		
		next.thread('environment-loop', i, j, k + 1, files);
	})
	
	//start to generate each file to build
	.thread('copy-file-to-build', function(i, j, k, l, files, content, data, next) {	
		//what's the detination?
		var root = this.getEvePath() + '/generate/' + types[j];
		
		var destination = this.path(this.getBuildPath() 
			+ '/package/' + packages[i] + '/' 
			+ environments[types[j]][k].name 
			+ files[l].path.substr(root.length));
		
		destination = destination.replace('SLUG', data.name);
		
		this.trigger('message', 'Copying to: ' + destination);
		
		var callback = next.thread.bind(
			null, 'copy-file-to-deploy', 
			i, j, k, l, files, content, data);
		
		this.File(destination).setContent(content, callback);
	})
	
	//start to generate each file to deploy
	.thread('copy-file-to-deploy', function(i, j, k, l, files, content, data, error, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		//what's the detination?
		var root = this.getEvePath() + '/generate/' + types[j];
		
		var extra = '';
		
		if(environments[types[j]][k].settings.type === 'admin'
		|| environments[types[j]][k].settings.type === 'web') {
			extra = '/application';	
		}
		
		//set the deploy path
		this.setDeployPath(environments[types[j]][k].settings.path);
		
		var destination = this.path(this.getDeployPath() 
			+ extra + '/package/' + packages[i]
			+ files[l].path.substr(root.length));
		
		destination = destination.replace('SLUG', data.name);
		
		this.trigger('message', 'Copying to: ' + destination);
		
		var callback = next.thread.bind(
			null, 'copy-next-file', i, j, k, l, files);
			
		this.File(destination).setContent(content, callback);
	})
	
	//move on to next file to build path
	.thread('copy-next-file', function(i, j, k, l, files, error, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		next.thread('transform-file', i, j, k, l + 1, files);
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
		eve.trigger('generate-complete', packages, environments);
		next();
	});
};