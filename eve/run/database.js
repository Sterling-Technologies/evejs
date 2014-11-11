module.exports = function(eve, command, noDeploy) {
	var wizard 			= require('prompt'),
		settings 		= eve.getSettings(),
		build 			= eve.getBuildPath(),
		config 			= { type: 'mysql'},
		environments	= Object.keys(settings.environments);
	
	//clear cache
	eve.Folder('/').clear();
	
	eve.sync(function(next) {
		var copy = [{
			name 		: 'key',
			description : 'What is the name of this configuration? (Default: eve)',
			type 		: 'string' 
		}, {
			name 		: 'type',
			description : 'What kind of database? (Default: mysql)',
			type 		: 'string' 
		}];
		
		wizard.get(copy, function(error, result) {
			if(error) {
				this.trigger('error', error);
				return;
			}
			
			if(['mysql', 'postgres', 'sqlite', 'mongo']
			.indexOf(result.type.toLowerCase()) !== -1) {
				config.type = result.type.toLowerCase();
			}
			
			next(result.key || 'eve');
		}.bind(this));
	})
	
	.then(function(key, next) {
		var copy = [];
		
		switch(config.type) {
			case 'mongo':
				copy.push({
					name 		: 'host',
					description : 'What is the host? (Default: 127.0.0.1)',
					type 		: 'string' });
				
				copy.push({
					name 		: 'port',
					description : 'What is the port?',
					type 		: 'number' });
				
				copy.push({
					name 		: 'name',
					description : 'What is the name? (Default: '+key+')',
					type 		: 'string' });
				
				break;
			case 'mysql':	
			case 'postgres':
				copy.push({
					name 		: 'host',
					description : 'What is the host? (Default: 127.0.0.1)',
					type 		: 'string' });
				
				copy.push({
					name 		: 'port',
					description : 'What is the port?',
					type 		: 'number' });
				
				copy.push({
					name 		: 'name',
					description : 'What is the name? (Default: '+key+')',
					type 		: 'string' });
				
				copy.push({
					name 		: 'user',
					description : 'What is the user? (Default: root)',
					type 		: 'string' });
					
				copy.push({
					name 		: 'pass',
					description : 'What is the password?',
					type 		: 'string' });
				break;
			
			case 'sqlite':
				copy.push({
					name 		: 'file',
					description : 'Where is the file located?',
					type 		: 'string' });
				
				break;
		}
		
		if(config.type === 'mysql') {
			copy.push({
				name 		: 'default',
				description : 'Is this the default database? (Default: Yes)',
				type 		: 'string' });
		}
		
		wizard.get(copy, function(error, result) {
			if(error) {
				eve.trigger('error', error);
				return;
			}
			
			switch(config.type) {
				case 'mongo':
					config.host = result.host || '127.0.0.1';
					config.port = result.port || null;
					config.name = result.name || key;
					
					break;
				case 'mysql':	
				case 'postgres':
					config.host = result.host || '127.0.0.1';
					config.port = result.port || null;
					config.name = result.name || 'eve';
					config.user = result.user || 'root';
					config.pass = result.pass || '';
					break;
				case 'sqlite':
					config.file = result.file;
					break;
			}
			
			if(config.type === 'mysql') {
				config.default = true;
				
				if(['n', 'no'].indexOf(result.default.toLowerCase()) !== -1) {
					config.default = false;
				}
			}
			
			settings.databases[key] = config;
			
			next();
		});
	})
	
	.then(function(next) {
		eve.setSettings(settings, function(error) {
			if(error) {
				eve.trigger('error', error);
				return;
			}
			
			//look for databases to be updated
			next.thread('environment-loop', 0);
		});
	})
	
	.thread('environment-loop', function(i, next) {
		if(i < environments.length) {
			if(settings.environments[environments[i]].type !== 'server') {
				next.thread('environment-loop', i + 1);
				return;
			}
			
			var file = build + '/config/' + environments[i] + '/databases.json';
			
			if(!this.File(file).isFile()) {
				next.thread('environment-loop', i + 1);
				return;
			}
			
			this.File(file).setData(settings.databases, function(error) {
				if(error) {
					eve.trigger('error', error);
					return;
				}
				
				next.thread('environment-loop', i + 1);
			});
			
			return;
		}
		
		next();
	})
	
	.then(function(next) {
		eve.trigger('database-complete', config, noDeploy);
	});
};