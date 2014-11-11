var eve 		= require('./eve.js'),
	nodemon 	= require('./eve/nodemon'),
	mocha 		= require('./eve/mocha'),
	command 	= Array.prototype.slice.apply(process.argv),
	executable	= command.shift(),
	bin 		= command.shift();

eve()
	.on('error', function(message, soft) {
		console.log('\x1b[31m%s\x1b[0m', message);
		
		if(!soft) {
			this.trigger('complete');
		}
	})
	
	.on('success', function(message) {
		console.log('\x1b[32m%s\x1b[0m', message);
	})
	
	.on('message', function(message) {
		console.log('\x1b[33m%s\x1b[0m', message);
	})
	
	.on('database-complete', function(config, noDeploy) {
		this.trigger('success', 'Database has been added!');
		
		if(!noDeploy) {
			this.trigger('message', 'Deploying environments ...');
			require('./eve/run/deploy')(this, []);
			return;
		}
		
		this.trigger('complete');
	})
	
	.on('create-complete', function(name, type, noDeploy) {
		this.trigger('success', name + ' installation complete!');
		
		if(!noDeploy) {
			this.trigger('message', 'Deploying environments ...');
			require('./eve/run/deploy')(this, []);
			return;
		}
		
		this.trigger('complete');
	})
	
	.on('generate-complete', function(package, environments) {
		this.trigger('success', package + ' was successfully generated!');
		this.trigger('message', 'Deploying environments ...');
		
		require('./eve/run/deploy')(this, []);
	})
	
	.on('relate-complete', function(schema, environments) {
		this.trigger('success', schema.name + ' was successfully generated!');
		this.trigger('message', 'Deploying environments ...');
		
		require('./eve/run/deploy')(this, []);
	})
	
	.on('remove-complete', function(package) {
		this.trigger('success', package + ' was successfully removed!');
		this.trigger('message', 'Deploying environments ...');
		
		require('./eve/run/deploy')(this, []);
	})
	
	.on('deploy-complete', function() {
		this.trigger('success', 'Build files were successfully deployed!');
		this.trigger('message', 'Mapping ...');
		
		require('./eve/run/map')(this, []);
	})
	
	.on('map-complete', function() {
		this.trigger('success', 'Deploy files were successfully mapped!');
		
		this.trigger('complete');
	})
	
	.on('watch-init', function(watcher, environments) {
		process.stdin.once('data', function(command) {
			command = command.toString().trim().split(' ');
			
			if(command[0] !== 'watch') {
				this.once('complete', function() {
					var command = 'watch ' + environments.join(',');
						command = command.split(' ');
					
					this.run(command);
				});
			}
			
			this.trigger('message', 'Shutting down watcher ...');
			
			for(var i = 0; i < watching.length; i++) {
				watching[i].nodemon.emit('quit');
			}
			
			watcher.close();
			
			this.run(command);
		}.bind(this));
		
		var settings = this.getSettings();
		
		for(var watching = [], config, i = 0; i < environments.length; i++) {
			if(settings.environments[environments[i]].type === 'server') {
				// starts the nodemon
				config = settings.environments[environments[i]].nodemon || {
					scriptPosition : 1, 
					script : 'index.js',
					args : ['--harmony'],
					cwd: settings.environments[environments[i]].path,
					ignore: ['node_modules', 'upload'],
					ext: 'js json' };
				
				//eventually we should write a better programmatic nodemon and watcher
				//but for now it's this...
				watching.push({
					environment: environments[i], 
					nodemon: nodemon(eve, config) });
			}
		}
		
		this.trigger('message', 'watching on ' + environments.join(', '));
	})
	
	.on('watch-update', function(event, type, name, source, destination, push) {
		//we only care if something has changed
		if (event !== 'change' && event !== 'add') {
			console.log('\x1b[32m%s\x1b[0m', event + ' - ' + destination);
			
			push(event, source, destination, function(error) {
				if (error) {
					eve().trigger('error', error);
				}
			});
			
			return;
		}

		//we only care if this is a js file
		if (this.File(source).getExtension() !== 'js') {
			this.trigger('success', event + ' - ' + destination);
			push(event, source, destination, function(error) {
				if (error) {
					eve().trigger('error', error);
				}
			});
			
			return;
		}
		
		var build 		= this.getBuildPath(),
			settings 	= this.getSettings();
		
		//if this is a test file
		if(source.substr((build + '/package').length).split('/')[4] === 'test') {
			//do not push just run the test
			this.trigger('message', 'Testing ...');
			
			//delete the cache to reload again
			delete require.cache[source];

			mocha.reset().run(eve, [source]);
			return;
		}
		
		//we only care if there are tests
		if(!(settings.environments[name].test instanceof Array)
		|| !settings.environments[name].test.length) {
			console.log('\x1b[32m%s\x1b[0m', event + ' - ' + destination);
			push(event, source, destination, function(error) {
				if (error) {
					eve().trigger('error', error);
				}
			});
			
			return;
		} 
		
		//okay it is a js file, it is not a test file and we have testing to do
		this.trigger('success', event + ' - ' + destination);
		
		//generate a list of test folders
		for(var tests = [], i = 0; i < settings.environments[name].test.length; i++) {
			//settings.environments[name].test[i] -> sample/sample
			tests.push(build + '/package/' + settings.environments[name].test[i] + '/' + name + '/test');
		}
		
		//capture the contents of the deploy folder
		this
		
		.sync(function(next) {
			this.File(destination).getContent(next);
		})
		//then call the push command
		.then(function(error, content, next) {
			push(event, source, destination, next.bind(this, content));	
		})
		//then run the mocha tests
		.then(function(content, error, next) {
			if (error) {
				eve().trigger('error', error);
				return;
			}
			
			this.trigger('message', 'Testing ...');
			mocha.run(eve, tests, next.bind(this, content));
		})
		//then revert if nessisary
		.then(function(content, failed, next) {
			//if there was a fail and this is not a mocha test
			if(failed) {
				//revert
				this
					.trigger('error', 'Reverting ' + destination + ' because of a failed test')
					.File(destination).setContent(content.toString('utf8'));
			}
		});
	})
	
	//update map
	.on('watch-update', function(event, type, name, source, destination, push) {
		//we only care if this is not a server
		if(type === 'server') {
			return;
		}
		
		//we only care if we are creating or unlinking
		if(event !== 'add' && event !== 'unlink') {
			return;
		}
		
		this.trigger('message', 'Mapping ...');
		
		require('./eve/run/map')(this, [name]);
	})
	
	//nodemon events
	.on('nodemon-start', function() {
		console.log('\x1b[35m%s\x1b[0m', 'Server has started ...');
	})
	.on('nodemon-quit', function() {
		console.log('\x1b[35m%s\x1b[0m', 'Server has stopped ...');
	})
	.on('nodemon-restart', function() {
		console.log('\x1b[35m%s\x1b[0m', 'Server has restarted ...');
	})
	
	.run(command);