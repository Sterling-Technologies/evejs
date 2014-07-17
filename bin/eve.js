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
/**
 * Module Dependencies
 */
var cli = require('cli');
var prompt = require('prompt');
var eden = require('edenjs');
var _ = require('underscore');
var lint = require('../lib/lint');

/**
 * CLI Settings
 */
cli.parse(null, {
    init : ['Creates an eve package.json'],
    install : [
        'Install the evejs',
        'Alias for `eve install all`.',
        'Arguments: all, web, control, server'
    ],
    watch : [
        'Watches the evejs packages',
        'Alias for `eve watch all`.',
        'Arguments: all, web, control, server'
    ],
    generate : [
        'Generates a control view and server controllers from schema.',
        'Argument: schema path'
    ]
});

/**
 * Prompt Settings
 */
prompt.message = '';
prompt.delimiter = '';
var promptProps = [
    {
        name : 'server',
        description : 'Eve server path (default: src/server):',
        type : 'string'
    },
    {
        name : 'control',
        description : 'Eve control environment path (default: src/control):',
        type : 'string'
    },
    {
        name : 'web',
        description : 'Eve web environment path (default: src/web):',
        type : 'string'
    }
];

/**
 * LINT Config
 */
var LINT_CONFIG = {
    SERVER : {
        bitwise : false,
        strict : false,
        node : true
    },
    CONTROL : {
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
    },
    WEB : {
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
    }
};

/**
 * Catches unspected errors.
 */
process.on('uncaughtException', function(err) {
    console.log('Uncaught Error: %s\n\t%s', err.name, err.stack);
});

/**
 * Paths
 */
var local = process.env.PWD || process.cwd(),
        //NOTE: maybe find a better way to find the root folder
        root = process.mainModule.filename.substr(0, process.mainModule.filename.length - '/bin/eve.js'.length);

var evejs = require('../lib/').
        setRoot(root).
        listen('error', function(message) {
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
            console.log('\x1b[32m%s\x1b[0m', 'Watching control changes ...');
        })
        .listen('watch-control-update', function(event, path, destination) {
            console.log('\x1b[32m%s\x1b[0m', event + ' - ' + destination);
        })
        .listen('watch-control-update', function(event, path, dest, eve) {
            if (event !== 'change') {
                return false;
            }

            var file = eden('file', path);

            if (file.getExtension() !== 'js') {
                return false;
            }

            file.getContent(function(err, code) {
                if (err) {
                    return eve.trigger('error', 'Control: Error getting the content of file:' + path);
                }

                lint(code.toString(), LINT_CONFIG.CONTROL, path);
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
        .listen('watch-server-init', function() {
            console.log('\x1b[32m%s\x1b[0m', 'Watching server changes ...');
        })
        .listen('watch-server-update', function(event, path, destination) {
            console.log('\x1b[32m%s\x1b[0m', event + ' - ' + destination);
        })
        .listen('watch-server-update', function(event, path, dest, eve) {
            if (event !== 'change') {
                return false;
            }

            var file = eden('file', path);

            if (file.getExtension() !== 'js') {
                return false;
            }

            file.getContent(function(err, code) {
                if (err) {
                    return eve.trigger('error', 'Server: Error getting the content of file:' + path);
                }

                lint(code.toString(), LINT_CONFIG.SERVER, path);
            });
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
            console.log('\x1b[32m%s\x1b[0m', 'Watching web changes ...');
        })
        .listen('watch-web-update', function(event, path, destination) {
            console.log('\x1b[32m%s\x1b[0m', event + ' - ' + destination);
        })
        .listen('watch-web-update', function(event, path, dest, eve) {
            if (event !== 'change') {
                return false;
            }

            var file = eden('file', path);

            if (file.getExtension() !== 'js') {
                return false;
            }

            file.getContent(function(err, code) {
                if (err) {
                    return eve.trigger('error', 'Web: Error getting the content of file:' + path);
                }

                lint(code.toString(), LINT_CONFIG.WEB, path);
            });
        })

        //generate events
        .listen('generate-step-1', function(source) {
            console.log('\x1b[33m%s\x1b[0m',
                    'Looping Through ' + source + ' ...');
        })
        .listen('generate-step-2', function(packageName) {
            console.log('\x1b[33m%s\x1b[0m',
                    'Creating ' + packageName + ' Folder ...');
        })
        .listen('generate-step-3', function(packageName, folder) {
            console.log('\x1b[33m%s\x1b[0m',
                    'Copying ' + packageName + '/' + folder + ' Folder ...');
        })
        .listen('generate-step-4', function(packageName) {
            console.log('\x1b[33m%s\x1b[0m',
                    'Building ' + packageName + ' Form ...');
        })
        .listen('generate-step-5', function(packageName) {
            console.log('\x1b[33m%s\x1b[0m',
                    'Writing ' + packageName + ' Form File ...');
        })
        .listen('generate-step-6', function(packageName) {
            console.log('\x1b[33m%s\x1b[0m',
                    'Building ' + packageName + ' Validation ...');
        })
        .listen('generate-step-7', function(packageName) {
            console.log('\x1b[33m%s\x1b[0m',
                    'Building ' + packageName + ' Schema ...');
        })
        .listen('generate-step-8', function(packageName) {
            console.log('\x1b[33m%s\x1b[0m',
                    'Replacing File Stubs ...');
        })
        .listen('generate-step-complete', function(packageName) {
            console.log('\x1b[33m%s\x1b[0m',
                    'Generating ' + packageName + ' Complete!');
        });

/**
 * Process the CLI command
 */
var action = cli.command || 'watch';
switch (action) {
    case 'init':
        var packageFile = eden('file', local + '/package.json');

        if (!packageFile.isFile()) {
            cli.fatal('Cannot open package.json.' +
                    ' Type `npm init` to create one.');
            break;
        }

        prompt.start();
        cli.info('This utility will walk you through creating a eve package.json file.');

        prompt.get(promptProps, function(err, result) {
            if (err) {
                return 1;
            }

            packageFile.getContent(function(err, content) {
                if (err) {
                    throw err;
                }

                content = JSON.parse(content.toString());
                content.eve = {
                    'server' : result.server || 'src/server',
                    'control' : result.control || 'src/control',
                    'web' : result.web || 'src/web'
                };

                content.lint_config = {
                    server : LINT_CONFIG.SERVER,
                    control : LINT_CONFIG.CONTROL,
                    web : LINT_CONFIG.WEB
                };

                content = JSON.stringify(content, null, 4);

                packageFile.setContent(content, function(err) {
                    if (err) {
                        throw err;
                    }

                    cli.ok('package.json updated');
                });
            });
        });
        break;
    case 'install':
    case 'watch':
    case 'generate':
        var packageFile = eden('file', local + '/package.json');

        if (packageFile.isFile()) {
            packageFile.getContent(function(err, content) {
                if (err) {
                    throw err;
                }

                content = JSON.parse(content.toString());

                var config = { };

                if (content.lint_config) {
                    for (var env in content.lint_config) {
                        if (content.lint_config.hasOwnProperty(env)) {
                            var newEnv = env.toUpperCase();
                            config[newEnv] = content.lint_config[env];
                        }
                    }
                }

                _.extend(LINT_CONFIG, config);
            });
        }

        var section = cli.args.shift() || 'all';
        evejs.run(local, action, section);
        break;
}