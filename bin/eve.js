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
var eden = require('edenjs');
var lint = require('../lib/lint');

var LINT_CONFIG = {
    SERVER : {
        strict : true,
        node : true
    },
    CONTROL : {
        strict : false,
        browser : true,
        jquery : true,
        node : false
    },
    WEB : {
        strict : false,
        browser : true,
        jquery : true,
        node : false
    }
};

var local = process.env.PWD || process.cwd(),
        //NOTE: maybe find a better way to find the root folder
        root = process.mainModule.filename.substr(0, process.mainModule.filename.length - '/bin/eve.js'.length),
        action = process.argv[2] || 'watch',
        section = process.argv[3] || 'all';

require('../lib/').
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
        })

        .run(local, action, section);