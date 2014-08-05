#!/usr/bin/env node
/* Sample Commands:
 * eve 					- Alias for "eve watch all"
 * eve install			- Alias for "eve install all"
 * eve install web		- Installs web only
 * eve install control	- Installs control only
 * eve install server	- Installs server only
 * eve watch			- Alias for "eve watch all"
 * eve watch web		- Watches changes in web only
 * eve watch control	- Watches changes in control only
 * eve watch server		- Watches changes in server only
 * eve generate ecommerce/product
 */
var eden 	= require('edenjs'),
	lint 	= require('../lib/lint'),
	nodemon = require('../lib/nodemon'),
	mocha 	= require('../lib/mocha'),
	local 	= process.env.PWD || process.cwd(),
	//NOTE: maybe find a better way to find the root folder
	root 	= process.mainModule.filename.substr(0, process.mainModule.filename.length - '/bin/eve.js'.length),
	action 	= process.argv[2] || 'watch';

var defaults = {
	server: {
		bitwise : false,
		strict 	: false,
		node 	: true
	},
	
	control: {
		globals: {
			define 		: true,
			controller 	: true,
			console 	: true,
			require 	: true,
			Handlebars 	: true,
			
			describe   	: true,
			it         	: true,
			before     	: true,
			beforeEach 	: true,
			after      	: true,
			afterEach  	: true 
		},
		
		bitwise 	: false,
		strict 		: false,
		browser 	: true,
		jquery 		: true,
		node 		: false
	},
	
	web: {
		globals : {
			define 		: true,
			controller 	: true,
			console 	: true,
			require 	: true,
			Handlebars 	: true,
			
			describe   	: true,
			it         	: true,
			before     	: true,
			beforeEach 	: true,
			after      	: true,
			afterEach  	: true 
		},
		
		bitwise : false,
		strict 	: false,
		browser : true,
		jquery 	: true,
		node 	: false
	}
};

var _getContent = function(source, destination, callback) {
	eden('file', source).getContent(function(error, to) {
		if (error) {
			eve.trigger('error', 'Error getting the content of file:' + source);
			return;
		}
		
		eden('file', destination).getContent(function(error, from) {
			if (error) {
				eve.trigger('error', 'Error getting the content of file:' + destination);
				return;
			}
			
			callback(to.toString(), from.toString());
		});
	});
};

require('../lib/')
        .setRoot(root)
        //global events
        .listen('error', function(message) {
            console.log('\x1b[31m%s\x1b[0m', message);
        })

        //control events
        .listen('install-control-step-1', function() {
            console.log('\x1b[33m%s\x1b[0m', 'Creating Control Folder ...');
        })
        .listen('install-control-step-2', function() {
            console.log('\x1b[33m%s\x1b[0m', 'Copying Control Files ...');
        })
        .listen('install-control-step-3', function() {
            console.log('\x1b[33m%s\x1b[0m', 'Copying Control Config ...');
        })
        .listen('install-control-step-4', function() {
            console.log('\x1b[33m%s\x1b[0m', 'Copying Control Config Locally ...');
        })
        .listen('install-control-step-5', function() {
            console.log('\x1b[33m%s\x1b[0m', 'Copying Control Packages ...');
        })
        .listen('install-control-complete', function() {
            console.log('\x1b[32m%s\x1b[0m', 'Control Installation Complete!');
        })
        .listen('watch-control-init', function() {
            console.log('\x1b[32m%s\x1b[0m', 'Watching for control changes ...');
        })
		
		.listen('watch-control-update', function(event, source, destination, eve, local, config, push) {
            //we only care if something has changed
            if (event !== 'change' && event !== 'add') {
                console.log('\x1b[32m%s\x1b[0m', event + ' - ' + destination);
                push(event, source, destination);
                return;
            }

            //we only care if this is a js file
            if (eden('file', source).getExtension() !== 'js') {
                console.log('\x1b[32m%s\x1b[0m', event + ' - ' + destination);
                push(event, source, destination);
                return;
            }
			
			//if this is a test file
			if(source.substr((local + '/package').length).split('/')[4] == 'test') {
				//do not push just run the test
				console.log('\x1b[33m%s\x1b[0m', 'Testing');
				
				//delete the cache to reload again
				delete require.cache[source];

				mocha.reset().run(local, 'control', config.control);
				return;
			}

            //get the code
			_getContent(source, destination, function(to, from) {
				config.control.lint = eden('hash').merge(defaults.control, config.control.lint || {});
					
				 //make sure node is false
				config.control.lint.node = false;
				
				//if there is an error
				if (!lint(to.toString(), config.control.lint, source)) {
					return;
				}
				
				//push it
				console.log('\x1b[32m%s\x1b[0m', event + ' - ' + destination);
				
				push(event, source, destination, function(error) {
					if (error) {
						eve.trigger('error', error);
						return;
					}
					
					if(!(config.control.test instanceof Array)) {
						return;
					}
					
					console.log('\x1b[33m%s\x1b[0m', 'Testing');
					mocha.run(local, 'control', config.control, function(failed) {
						//if there was a fail and this is not a mocha test
						if(failed && source.substr((local + '/package').length).split('/')[4] != 'test') {
							//revert
							eden('file', destination).setContent(from);
						}
					});
				});
			});
        })
		
        //server events
        .listen('install-server-step-1', function() {
            console.log('\x1b[33m%s\x1b[0m', 'Creating Server Folder ...');
        })
        .listen('install-server-step-2', function() {
            console.log('\x1b[33m%s\x1b[0m', 'Copying Server Files ...');
        })
        .listen('install-server-step-3', function() {
            console.log('\x1b[33m%s\x1b[0m', 'Copying Server Config ...');
        })
        .listen('install-server-step-4', function() {
            console.log('\x1b[33m%s\x1b[0m', 'Copying Server Config Locally ...');
        })
        .listen('install-server-step-5', function() {
            console.log('\x1b[33m%s\x1b[0m', 'Copying Server Packages ...');
        })
        .listen('install-server-step-6', function() {
            console.log('\x1b[33m%s\x1b[0m', 'npm install ...');
        })
        .listen('install-server-complete', function() {
            console.log('\x1b[32m%s\x1b[0m', 'Server Installation Complete!');
        })
        .listen('watch-server-init', function(eve, local, config) {
            console.log('\x1b[32m%s\x1b[0m', 'Watching for server changes ...');

            // build the settings
            var settings = config.server.nodemon || {};

            // if settings.cwd is not defined
            if (!settings.cwd) {
                // we use the default cwd is the server path
                settings.cwd = config.server.path;
            }

            // starts the nodemon
            nodemon(eve, settings);
        })
        .listen('watch-server-update', function(event, source, destination, eve, local, config, push) {
            //we only care if something has changed
            if (event !== 'change' && event !== 'add') {
                console.log('\x1b[32m%s\x1b[0m', event + ' - ' + destination);
                push(event, source, destination);
                return;
            }

            //we only care if this is a js file
            if (eden('file', source).getExtension() !== 'js') {
                console.log('\x1b[32m%s\x1b[0m', event + ' - ' + destination);
                push(event, source, destination);
                return;
            }
			
			//if this is a test file
			if(source.substr((local + '/package').length).split('/')[4] == 'test') {
				//do not push just run the test
				console.log('\x1b[33m%s\x1b[0m', 'Testing');
				
				//delete the cache to reload again
				delete require.cache[source];
				
				mocha.reset().run(local, 'server', config.server);
				return;
			}
			
			//get the code
			_getContent(source, destination, function(to, from) {
				config.server.lint = eden('hash').merge(defaults.server, config.server.lint || {});
					
				 //make sure node is false
				config.server.lint.node = true;
				
				//if there is an error
				if (!lint(to.toString(), config.server.lint, source)) {
					return;
				}
				
				//push it
				console.log('\x1b[32m%s\x1b[0m', event + ' - ' + destination);
				
				push(event, source, destination, function(error) {
					if (error) {
						eve.trigger('error', error);
						return;
					}
					
					if(!(config.server.test instanceof Array)) {
						return;
					}
					
					console.log('\x1b[33m%s\x1b[0m', 'Testing');
					mocha.run(local, 'server', config.server, function(failed) {
						//if there was a fail and this is not a mocha test
						if(failed && source.substr((local + '/package').length).split('/')[4] != 'test') {
							//revert
							eden('file', destination).setContent(from);
						}
					});
				});
			});
        })
		
		//nodemon events
		.listen('nodemon-start', function() {
        	console.log('\x1b[35m%s\x1b[0m', 'Server has started ...');
		})
		.listen('nodemon-quit', function() {
        	console.log('\x1b[35m%s\x1b[0m', 'Server has stopped ...');
		})
		.listen('nodemon-restart', function() {
			console.log('\x1b[35m%s\x1b[0m', 'Server has restarted ...');
		})

        //web events
        .listen('install-web-step-1', function() {
            console.log('\x1b[33m%s\x1b[0m', 'Creating Web Folder ...');
        })
        .listen('install-web-step-2', function() {
            console.log('\x1b[33m%s\x1b[0m', 'Copying Web Files ...');
        })
        .listen('install-web-step-3', function() {
            console.log('\x1b[33m%s\x1b[0m', 'Copying Web Config ...');
        })
        .listen('install-web-step-4', function() {
            console.log('\x1b[33m%s\x1b[0m', 'Copying Web Config Locally ...');
        })
        .listen('install-web-step-5', function() {
            console.log('\x1b[33m%s\x1b[0m', 'Copying Web Packages ...');
        })
        .listen('install-web-complete', function() {
            console.log('\x1b[32m%s\x1b[0m', 'Web Installation Complete!');
        })
        .listen('watch-web-init', function() {
            console.log('\x1b[32m%s\x1b[0m', 'Watching for web changes ...');
        })
        .listen('watch-web-update', function(event, source, destination, eve, local, config, push) {
            //we only care if something has changed
            if (event !== 'change' && event !== 'add') {
                console.log('\x1b[32m%s\x1b[0m', event + ' - ' + destination);
                push(event, source, destination);
                return;
            }

            //we only care if this is a js file
            if (eden('file', source).getExtension() !== 'js') {
                console.log('\x1b[32m%s\x1b[0m', event + ' - ' + destination);
                push(event, source, destination);
                return;
            }
			
			//if this is a test file
			if(source.substr((local + '/package').length).split('/')[4] == 'test') {
				//do not push just run the test
				console.log('\x1b[33m%s\x1b[0m', 'Testing');
				
				//delete the cache to reload again
				delete require.cache[source];
				
				mocha.reset().run(local, 'web', config.web);
				return;
			}

            //get the code
			_getContent(source, destination, function(to, from) {
				config.web.lint = eden('hash').merge(defaults.web, config.web.lint || {});
					
				 //make web node is false
				config.control.lint.node = false;
				
				//if there is an error
				if (!lint(to.toString(), config.web.lint, source)) {
					return;
				}
				
				//push it
				console.log('\x1b[32m%s\x1b[0m', event + ' - ' + destination);
				
				push(event, source, destination, function(error) {
					if (error) {
						eve.trigger('error', error);
						return;
					}
					
					if(!(config.web.test instanceof Array)) {
						return;
					}
					
					console.log('\x1b[33m%s\x1b[0m', 'Testing');
					mocha.run(local, 'web', config.web, function(failed) {
						//if there was a fail and this is not a mocha test
						if(failed && source.substr((local + '/package').length).split('/')[4] != 'test') {
							//revert
							eden('file', destination).setContent(from);
						}
					});
				});
			});
        })

        .run(local, action);