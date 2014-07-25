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
var eden 		= require('edenjs'),
        lint 	= require('../lib/lint'),
        nodemon = require('../lib/nodemon'),
        mocha = require('../lib/mocha'),
        local 	= process.env.PWD || process.cwd(),
        //NOTE: maybe find a better way to find the root folder
        root 	= process.mainModule.filename.substr(0, process.mainModule.filename.length - '/bin/eve.js'.length),
        action 	= process.argv[2] || 'watch';

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
        .listen('watch-control-update', function(event, path, destination, eve, local, config, push) {
            //we only care if something has changed
            if (event !== 'change' && event !== 'add') {
                console.log('\x1b[32m%s\x1b[0m', event + ' - ' + destination);
                push(event, path, destination);
                return;
            }

            var file = eden('file', path);
            var controlConfig = config.control;

            //we only care if this is a js file
            if (file.getExtension() !== 'js') {
                console.log('\x1b[32m%s\x1b[0m', event + ' - ' + destination);
                push(event, path, destination);
                return;
            }

            //get the code
            file.getContent(function(error, code) {
                if (error) {
                    eve.trigger('error', 'Control: Error getting the content of file:' + path);
                    return;
                }
                
                var isTest = destination.indexOf(controlConfig.path + '/test/') === 0;
                var config = isTest ? controlConfig.lint_mocha : controlConfig.lint;

                config = eden('hash').merge({
                    globals : {
                        define : true,
                        controller : true,
                        console : true,
                        require : true,
                        Handlebars : true
                    },
                    bitwise : false,
                    strict : false,
                    browser : true,
                    jquery : true,
                    node : false
                }, config || { });

                //make sure node is false
                config.node = false;

                //if there is an error
                if (!lint(code.toString(), config, path)) {
                    return;
                }

                //push it
                console.log('\x1b[32m%s\x1b[0m', event + ' - ' + destination);
                push(event, path, destination, function(err) {
                    if (err || !isTest) {
                        return;
                    }

                    var file = controlConfig.mocha + ' ' + destination;
                    console.log('\x1b[35m%s\x1b[0m', 'Mocha Test Suite (Control): ' + destination);
                    mocha.run(file, { cwd : controlConfig.path, stdio : 'inherit' });
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
        .listen('watch-server-update', function(event, path, destination, eve, local, config, push) {
            //we only care if something has changed
            if (event !== 'change' && event !== 'add') {
                console.log('\x1b[32m%s\x1b[0m', event + ' - ' + destination);
                push(event, path, destination);
                return;
            }

            var file = eden('file', path);
            var serverConfig = config.server;

            //we only care if this is a js file
            if (file.getExtension() !== 'js') {
                console.log('\x1b[32m%s\x1b[0m', event + ' - ' + destination);
                push(event, path, destination);
                return;
            }

            //get the code
            file.getContent(function(error, code) {
                if (error) {
                    eve.trigger('error', 'Server: Error getting the content of file:' + path);
                    return;
                }

                var isTest = destination.indexOf(serverConfig.path + '/test/') === 0;
                var config = isTest ? serverConfig.lint_mocha : serverConfig.lint;

                config = eden('hash').merge({
                    bitwise : false,
                    strict : false,
                    node : true
                }, config || { });

                //make sure node is true
                config.node = true;

                //if there is an error
                if (!lint(code.toString(), config, path)) {
                    return;
                }

                //push it
                console.log('\x1b[32m%s\x1b[0m', event + ' - ' + destination);
                push(event, path, destination, function(err) {
                    if (err || !isTest) {
                        return;
                    }

                    var file = serverConfig.mocha + ' ' + destination;
                    console.log('\x1b[35m%s\x1b[0m', 'Mocha Test Suite (Server): ' + destination);
                    mocha.run(file, { cwd : serverConfig.path, stdio : 'inherit' });
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
        .listen('watch-web-update', function(event, path, destination, eve, local, config, push) {
            //we only care if something has changed
            if (event !== 'change' && event !== 'add') {
                console.log('\x1b[32m%s\x1b[0m', event + ' - ' + destination);
                push(event, path, destination);
                return;
            }

            var file = eden('file', path);
            var webConfig = config.server;

            //we only care if this is a js file
            if (file.getExtension() !== 'js') {
                console.log('\x1b[32m%s\x1b[0m', event + ' - ' + destination);
                push(event, path, destination);
                return;
            }

            //get the code
            file.getContent(function(error, code) {
                if (error) {
                    eve.trigger('error', 'Web: Error getting the content of file:' + path);
                    return;
                }
                
                var isTest = destination.indexOf(webConfig.path + '/test/') === 0;
                var config = isTest ? webConfig.lint_mocha : webConfig.lint;

                config = eden('hash').merge({
                    globals : {
                        define : true,
                        controller : true,
                        console : true,
                        require : true,
                        Handlebars : true
                    },
                    bitwise : false,
                    strict : false,
                    browser : true,
                    jquery : true,
                    node : false
                }, config || { });

                //make sure node is false
                config.node = false;

                //if there is an error
                if (!lint(code.toString(), config, path)) {
                    return;
                }

                //push it
                console.log('\x1b[32m%s\x1b[0m', event + ' - ' + destination);
                push(event, path, destination, function(err) {
                    if (err || !isTest) {
                        return;
                    }

                    var file = webConfig.mocha + ' ' + destination;
                    console.log('\x1b[35m%s\x1b[0m', 'Mocha Test Suite (Web): ' + destination);
                    mocha.run(file, { cwd : webConfig.path, stdio : 'inherit' });
                });
            });
        })

        .run(local, action);