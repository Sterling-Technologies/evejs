/* Sample Commands:
 * eve 							- Alias for "eve watch all"
 * eve install					- Alias for "eve install all"
 * eve install web [name]		- Installs web only
 * eve install admin [name]		- Installs admin only
 * eve install server [name]	- Installs server only
 * eve watch					- Alias for "eve watch all"
 * eve watch [name]				- Watches changes in web only
 * eve generate ecommerce/product
 */
var eve 		= require('./eve.js'),
	nodemon 	= require('./eve/nodemon'),
	mocha 		= require('./eve/mocha'),
	command 	= Array.prototype.slice.apply(process.argv),
	executable	= command.shift(),
	bin 		= command.shift();

var processError = function(error) {
	if (error) {
		eve().trigger('error', error);
	}
};

eve()
	.on('error', function(message) {
		console.log('\x1b[31m%s\x1b[0m', message);
	})
	
	.on('message', function(message) {
		console.log('\x1b[33m%s\x1b[0m', message);
	})
	
	.on('install-step', function(step, name, type, deploy) {
		var message = false;
		
		switch(step) {
			case 1:
				message = 'installing ' + name + '...';
				break;
			case 2:
				message = 'Copying ' + type + ' to deploy.';
				break;
			case 3:
				message = 'Copying ' + type + ' to build.';
				break;
			case 4:
				message = 'Copying packages.';
				break;
			
		}
		
		if(message) {
			console.log('\x1b[33m%s\x1b[0m', message);
		}
	})
	
	.on('install-complete', function(name, type, deploy) {
		console.log('\x1b[32m%s\x1b[0m', name + ' installation complete!');
		process.exit(0);
	})
	
	.on('generate-complete', function(packages, environments) {
		console.log('\x1b[32m%s\x1b[0m', packages.join(', ') + ' were successfully generated!');
		process.exit(0);
	})
	
	.on('watch-init', function(environments) {
		var settings = this.getSettings();
		
		for(var name in settings) {
			if(settings.hasOwnProperty(name)) {
				if(settings[name].type === 'server') {
					// starts the nodemon
					var config = settings[name].nodemon || {
						scriptPosition : 1, 
						script : settings[name].path + '/index.js', 
						args : ['--harmony']
					};
					
					//tmp fix this with config
        			nodemon(eve, config);
				}
			}
		}
		
		console.log('\x1b[33m%s\x1b[0m', 'watching on ' + environments.join(', '));
	})
	
	.on('watch-update', function(event, type, name, source, destination, push) {
		//we only care if something has changed
		if (event !== 'change' && event !== 'add') {
			console.log('\x1b[32m%s\x1b[0m', event + ' - ' + destination);
			push(event, source, destination, processError);
			return;
		}

		//we only care if this is a js file
		if (this.File(source).getExtension() !== 'js') {
			console.log('\x1b[32m%s\x1b[0m', event + ' - ' + destination);
			push(event, source, destination, processError);
			return;
		}
		
		var build 		= this.getBuildPath(),
			settings 	= this.getSettings();
		
		//if this is a test file
		if(source.substr((build + '/package').length).split('/')[4] === 'test') {
			//do not push just run the test
			console.log('\x1b[33m%s\x1b[0m', 'Testing');
			
			//delete the cache to reload again
			delete require.cache[source];

			mocha.reset().run(eve, [source]);
			return;
		}
		
		//we only care if there are tests
		if(!(settings[name].test instanceof Array)
		|| !settings[name].test.length) {
			console.log('\x1b[32m%s\x1b[0m', event + ' - ' + destination);
			push(event, source, destination, processError);
			return;
		} 
		
		//okay it is a js file, it is not a test file and we have testing to do
		console.log('\x1b[32m%s\x1b[0m', event + ' - ' + destination);
		
		//generate a list of test folders
		for(var tests = [], i = 0; i < settings[name].test.length; i++) {
			//settings[name].test[i] -> sample/sample
			tests.push(build + '/package/' + settings[name].test[i] + '/' + name + '/test');
		}
		
		//capture the contents of the deploy folder
		this.sync(function(next) {
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
			
			console.log('\x1b[33m%s\x1b[0m', 'Testing2');
			mocha.run(eve, tests, next.bind(this, content));
		})
		//then revert if nessisary
		.then(function(content, failed, next) {
			//if there was a fail and this is not a mocha test
			if(failed) {
				//revert
				eve()
					.trigger('error', 'Reverting ' + destination + ' because of a failed test')
					.File(destination).setContent(content.toString('utf8'));
			}
		});
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