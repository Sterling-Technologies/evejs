'use strict';

/**
 * Module Dependencies
 */
var eden = require('edenjs');
var mocha = require('../lib/mocha');

/**
 * Tests the control mocha suite.
 * 
 * @param {Eve} eve
 * @param {Local} local
 * @param {Array} args
 */
module.exports = function(eve, local, args) {
    var buildFile = eden('file', local + '/build.json');

    // if this is a file
    if (!buildFile.isFile()) {
        eve.trigger('error', 'No control deploy directory set.');
        eve.listen('install-control-complete', runTestCallback);
        require('./install-control')(eve, local, args);
        return;
    }

    // this is a file
    buildFile.getContent(function(error, content) {
        if (error) {
            eve.trigger('error', error);
            return;
        }

        var json = JSON.parse(content);

        // if there is already a control path
        if (json.control && json.control.path) {
            runTestCallback();
            return;
        }

        // no control path set 
        eve.trigger('error', 'No control deploy directory set.');
        eve.listen('install-control-complete', runTestCallback);
        require('./install-control')(eve, local, args);
    });

    // run test callback
    function runTestCallback() {
        buildFile.getContent(function(error, content) {
            if (error) {
                eve.trigger('error', error);
                return;
            }

            console.log('\x1b[35m%s\x1b[0m', 'Mocha Test Suite: Control Environment');

            var config = JSON.parse(content);
            var opts = {
                cwd : config.control.path,
                stdio : 'inherit'
            };

            // run the mocha test suite
            var proc = mocha.run(config.control.mocha, opts);
            proc.on('exit', function(failures) {
                eve.trigger('test-control-complete');
            });
        });
    }
};