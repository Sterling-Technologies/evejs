'use strict';

/**
 * Module Exports
 */
var nodemon = require('nodemon');
var eden = require('edenjs');

/**
 * Local Properties
 */
var defaultSettings = { scriptPosition : 0, script : './index.js', args : [] };

/**
 * Runs the nodemon.
 * 
 * @param {Object} settings
 */
var run = function(eve, settings) {
    nodemon(settings);

    nodemon.on('start', function() {
		eve.trigger('nodemon-start');
    }).on('quit', function() {
		eve.trigger('nodemon-quit');
    }).on('restart', function(files) {
		eve.trigger('nodemon-restart', files);
    });
};

/**
 * Starts the nodemon.
 * 
 * @param {Object} settings
 * @returns {nodemon}
 */
module.exports = function(eve, settings) {
    // clone the settings and remove unnecessary properties
    settings = eden('hash').merge(defaultSettings, settings || { });
    settings = JSON.parse(JSON.stringify(settings));

    run(eve, settings);

    return nodemon;
};