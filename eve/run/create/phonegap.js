module.exports = function(eve, command, noDeploy) {
	var name 		= command[0] || 'phonegap',
		
		wizard 		= require('prompt'),
		
		settings	= eve.getSettings(),
		root		= eve.getEvePath(),
		build		= eve.getBuildPath(),
		config		= eve.path(root + '/build/phonegap/config/phonegap'),
		deploy		= eve.path(root + '/build/phonegap/deploy/phonegap'),
		batch		= eve.path(root + '/build/phonegap/package/batch/phonegap');
	
	//clear cache
	eve.Folder('/').clear();
	
	eve
	
	.sync(function(next) {
		this.trigger('message', 'Creating ' + name + ' (phonegap) ...');
		
		var destination = build + '/deploy/' + name;
		
		if(!this.Folder(destination).isFolder()) {
			next();
			return;
		}
		
		var copy = [{
			name 		: 'allow',
			description : 'The deploy path exists! Creating an environment '
						+ 'here will remove all custom changes. Do you want' 
						+ ' to continue ? (Default: No)',
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
			
			this.Folder(destination).remove(function(error) {
				if(error) {
					//this.trigger('error', error);
					//return;
				}
				
				next();
			}.bind(this));
		}.bind(this));
	})
	
	.then(function(next) {
		if(typeof settings.environments[name] === 'undefined') {
			settings.environments[name] = {};
		}
		
		settings.environments[name].type 		= 'phonegap';
		settings.environments[name].path 		= './deploy/' + name;
		
		if(typeof settings.environments[name].lint === 'undefined') {
			settings.environments[name].lint = {
				globals : {
					define 		: true,
					controller 	: true,
					console 	: true,
					require 	: true,
					Handlebars 	: true
				},
				
				bitwise 		: false,
				strict 			: false,
				browser 		: true,
				jquery 			: true,
				node 			: false,
				maxcomplexity	: 20
			};
		}
		
		this
		.setSettings(settings, function(error) {
			if(error) {
				this.trigger('error', error);
				return;
			}
			
			next();
		}.bind(this));
	})
	
	.then(function(next) {
		if(!this.Folder(root + '/build/phonegap').isFolder()) {
			next.thread('download');
			return;
		}
		
		next();
	})
	
	.thread('download', function(next) {
		if(!this.Folder(root + '/build').isFolder()) {
			require('fs').mkdirSync(root + '/build');
		}
		
		this.trigger('message', 'Downloading Environment ...');
		
		var request = require('request'),
			fs		= require('fs'),
			tar 	= require('tar'),
			gz 		= require('zlib'),
			
			start 	= 'https://raw.githubusercontent.com/Openovate/evejs/master/build/phonegap.tar.gz',
			end		= root + '/build',
			
			tmp		= 'tmp-' + Math.floor(Math.random() * 1000),
			step1 	= start,	
			step2 	= end + '/' + tmp + '.tar.gz',
			step3 	= end + '/' + tmp + '.tar',
			step4	= end;
		
		var from = request(step1);
		var to = fs.createWriteStream(step2);
		
		from.pipe(to);
		to.on('close', function() {
			this.trigger('message', 'Extracting Environment ...');
			
			var from = fs.createReadStream(step2);
			var to = fs.createWriteStream(step3);
			
			from.pipe(gz.createGunzip()).pipe(to);
			
			to.on('close', function() {
				var from = fs.createReadStream(step3);
				var to = tar.Extract({ path: step4 });
				
				from.pipe(to);
				to.on('close', function() {
					fs.unlink(step2, function() {
						fs.unlink(step3, function() {
							next()
						});
					});
				});
			});
		});
	})
	
	.then(function(next) {
		var source = root + '/build/phonegap';
		
		this
			.trigger('message', 'Copying phonegap files ...')
			.Folder(source).getFiles(null, true, next);
	})
	
	.then(function(error, files, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		next.thread('file-loop', 0, files);
	})
	
	.thread('file-loop', function(i, files, next) {
		if(i < files.length) {
			var source = root + '/build/phonegap';
			source = files[i].path.substr(source.length);
			
			var destination = build + source;
			
			if(files[i].path.indexOf(config) === 0) {
				destination = build + '/config/' + name + '/' + files[i].path.substr(config.length);
			} else if(files[i].path.indexOf(deploy) === 0) {
				destination = build + '/deploy/' + name + '/' + files[i].path.substr(deploy.length);
			} else if(files[i].path.indexOf(batch) === 0) {
				destination = build + '/package/batch/' + name + '/' + files[i].path.substr(batch.length);
			}
			
			files[i].copy(destination, function(error) {
				if(error) {
					this.trigger('error', error);
					return;
				}
				
				next.thread('file-loop', i + 1, files);
			}.bind(this));
			
			return;
		}
		
		next();
	})
	
	.then(function(next) {
		this.trigger('message', 'Updating environments ...');
		
		var meta = { environments: {} }, environments = Object.keys(settings.environments);
		
		for(var environment in settings.environments) {
			if(settings.environments.hasOwnProperty(environment)) {
				meta.environments[environment] = {
					type: settings.environments[environment].type, 
					protocol: settings.environments[environment].protocol, 
					host: settings.environments[environment].host, 
					port: settings.environments[environment].port };
			}
		}
		
		next.thread('environment-loop', 0, environments, meta);
	})
	
	.thread('environment-loop', function(i, environments, meta, next) {
		if(i < environments.length) {
			var file = this.File(build + '/config/' + environments[i] + '/settings.json');
			
			//get the settings data
			file.setData(meta, function(error, data) {			
				if(error) {
					this.trigger('error', error);
					return;
				}
				
				next.thread('environment-loop', i + 1, environments, meta);
			}.bind(this));
			
			return;
		}
		
		next();
	})
	
	//finish up
	.then(function(next) {
		this.trigger('create-complete', 'phonegap', name, noDeploy);	
		next();
	});
};