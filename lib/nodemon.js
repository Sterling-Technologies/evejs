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
var run = function(settings) {
    nodemon(settings);

    nodemon.on('start', function() {
        console.log('App has started');
    }).on('quit', function() {
        console.log('App has quit');
    }).on('restart', function(files) {
        console.log('App restarted due to: ', files);
    });
};

/**
 * Starts the nodemon.
 * 
 * @param {Object} settings
 * @returns {nodemon}
 */
module.exports = function(settings) {
    // clone the settings and remove unnecessary properties
    settings = eden('hash').merge(defaultSettings, settings || { });
    settings = JSON.parse(JSON.stringify(settings));

    run(settings);

    return nodemon;
};