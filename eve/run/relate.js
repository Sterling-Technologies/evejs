var copy = {
	'all': [
		'admin/action/index.js',
		'admin/event/client-request.js',
		'admin/event/FROM-update-output.js',
		'admin/event/NAME-create-error.js',
		'admin/event/NAME-create-success.js',
		'admin/event/TO-update-output.js',
		'admin/factory.js',
		'admin/index.js',
		'server/action/batch.js',
		'server/action/create.js',
		'server/action/FROM.js',
		'server/action/index.js',
		'server/action/remove.js',
		'server/action/TO.js',
		'server/event/NAME-create-error.js',
		'server/event/NAME-create-success.js',
		'server/event/NAME-create.js',
		'server/event/NAME-FROM-list-error.js',
		'server/event/NAME-FROM-list-success.js',
		'server/event/NAME-remove-error.js',
		'server/event/NAME-remove-success.js',
		'server/event/NAME-remove.js',
		'server/event/NAME-response.js',
		'server/event/NAME-TO-list-error.js',
		'server/event/NAME-TO-list-success.js',
		'server/event/server-request-end.js',
		'server/event/server-request-start.js',
		'server/factory.js',
		'server/index.js',
		'web/action/index.js',
		'web/event/client-request.js',
		'web/factory.js',
		'web/index.js' ],
		
	'one-to-one': [
		'admin/event/FROM-create-output.js',
		'admin/event/FROM-update-success.js',
		'admin/event/TO-create-output.js',
		'admin/event/TO-update-success.js' ],
		
	'one-to-many': [
		'admin/action/remove.js',
		'admin/action/TO.js',
		'admin/event/NAME-remove-error.js',
		'admin/event/NAME-remove-success.js',
		'admin/event/NAME-remove.js',
		'admin/event/NAME-TO-output.js',
		'admin/event/TO-create-output.js',
		'admin/event/TO-update-success.js',
		'admin/template/TO.html' ],
	
	'many-to-one': [
		'admin/action/FROM.js',
		'admin/action/remove.js',
		'admin/event/FROM-create-output.js',
		'admin/event/FROM-update-success.js',
		'admin/event/NAME-FROM-output.js',
		'admin/event/NAME-remove-error.js',
		'admin/event/NAME-remove-success.js',
		'admin/event/NAME-remove.js',
		'admin/template/FROM.html' ],
		
	'many-to-many': [
		'admin/action/FROM.js',
		'admin/action/remove.js',
		'admin/action/TO.js',
		'admin/event/NAME-FROM-output.js',
		'admin/event/NAME-remove-error.js',
		'admin/event/NAME-remove-success.js',
		'admin/event/NAME-remove.js',
		'admin/event/NAME-TO-output.js',
		'admin/template/FROM.html',
		'admin/template/TO.html' ]
};


module.exports = function(eve, command) {
	var handlebars 		= require('../handlebars'),
		package 		= command.shift(), 
		schema 			= null,  
		from 			= null,  
		to 				= null, 
		environments	= { server: [], admin: [], web: [] },
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
		schema = this.getBuildPath() + '/package/' + package + '/schema.json';
		
		//if the schema is not a file
		if(!this.File(schema).isFile()) {
			this.trigger('error', 'Invalid parameter. Must add a valid package name to parse');
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
		from = this.getBuildPath() + '/package/' + schema.from.package + '/schema.json';
		
		//if the from is not a file
		if(!this.File(from).isFile()) {
			this.trigger('error', '"from" package definition is invalid');
			return;
		} else {
			schema.from.schema = require(from);
		}
		
		//populate schema's sub-schemas
		to = this.getBuildPath() + '/package/' + schema.to.package + '/schema.json';
		
		//if the to is not a file
		if(!this.File(to).isFile()) {
			this.trigger('error', '"to" package definition is invalid');
			return;
		} else {
			schema.to.schema = require(to);
		}
		
		//validate references
		if(!schema.from.schema.fields[schema.from.reference]) {
			this.trigger('error', '"from.reference" is invalid');
			return;
		}
		
		//validate references
		if(!schema.to.schema.fields[schema.to.reference]) {
			this.trigger('error', '"to.reference" is invalid');
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
			database = this
				.trigger('message', 'Installing schema ...')
				.Mysql(
					database.host, 
					database.port, 
					database.name,
					database.user,
					database.pass);
			
			next.thread('drop', database);
			
			return;
		}
		
		this.trigger('error', 'No database found. Check your server config for databases.js');
		process.exit(0);
	})
	
	.thread('drop', function(database, next) {
		var callback = next.thread.bind(null, 'schema', database);
		
		database.query('DROP TABLE IF EXISTS `' + schema.name + '`;', callback);
	})
	
	.thread('schema', function(database, error, rows, meta, next) {
		//build the query
		var query = ['CREATE TABLE IF NOT EXISTS `' + schema.name + '` ('];
		query.push('`' + schema.from.column + '` int(10) unsigned NOT NULL,');
		query.push('`' + schema.to.column + '` int(10) unsigned NOT NULL');
		query.push(') ENGINE=InnoDB DEFAULT CHARSET=latin1;');
		
		var callback = next.thread.bind(null, 'primary-key', database);
		
		database.query(query.join("\n"), callback);
	})
	
	.thread('primary-key', function(database, error, rows, meta, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		var callback = next.thread.bind(null, 'fixture', database);
		
		database.query('ALTER TABLE `' + schema.name + '` ADD PRIMARY KEY (`' 
		+ schema.from.column + '`, `' + schema.to.column + '`);', 
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
			database.insertRow(schema.name, schema.fixture[i], function(error) {
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
				this.Folder(this.getEvePath() + '/relate/' + types[i]).getFiles(null, true, callback);
				
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
			var root = this.getEvePath() + '/relate/';
			if(copy.all.indexOf(files[k].path.substr(root.length)) === -1
			&& copy[schema.mode].indexOf(files[k].path.substr(root.length)) === -1) {
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
		var root = this.getEvePath() + '/relate/' + types[i];
		
		var destination = this.path(this.getBuildPath() 
			+ '/package/' + schema.name + '/' 
			+ environments[types[i]][j].name 
			+ files[k].path.substr(root.length));
		
		destination = destination
			.replace('NAME'	, schema.name)
			.replace('FROM'	, schema.from.schema.name)
			.replace('TO'	, schema.to.schema.name);
		
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
		var root = this.getEvePath() + '/relate/' + types[i];
		
		var extra = '';
		
		if(environments[types[i]][j].settings.type === 'admin'
		|| environments[types[i]][j].settings.type === 'web') {
			extra = '/application';	
		}
		
		//set the deploy path
		this.setDeployPath(environments[types[i]][j].settings.path);
		
		var destination = this.path(this.getDeployPath() 
			+ extra + '/package/' + schema.name
			+ files[k].path.substr(root.length));
		
		destination = destination
			.replace('NAME'	, schema.name)
			.replace('FROM'	, schema.from.schema.name)
			.replace('TO'	, schema.to.schema.name);
		
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
		eve.trigger('relate-complete', schema, environments);
		next();
	});
};