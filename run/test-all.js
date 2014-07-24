'use strict';

/**
 * Tests all environments.
 * 
 * @param {Eve} eve
 * @param {String} local
 * @param {Array} args
 */
module.exports = function(eve, local, args) {
    //install server
    require('./test-server.js')(eve, local, args);
};