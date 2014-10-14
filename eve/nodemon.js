'use strict';

/**
 * Module Exports
 */
var nodemon = require('nodemon');

/**
 * Local Properties
 */
var defaults = { scriptPosition : 0, script : './index.js', args : [] };

/**
 * Starts the nodemon.
 * 
 * @param {Object} settings
 * @returns {nodemon}
 */
module.exports = function(eve, settings) {
    nodemon(settings || defaults);

    nodemon.on('start', function() {
		eve().trigger('nodemon-start');
    }).on('quit', function() {
		eve().trigger('nodemon-quit');
    }).on('restart', function(files) {
		eve().trigger('nodemon-restart', files);
    });

    return nodemon;
};