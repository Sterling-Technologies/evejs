'use strict';

/**
 * Tests all environments.
 * 
 * @param {Eve} eve
 * @param {String} local
 * @param {Array} args
 */
module.exports = function(eve, local, args) {
    eve.listen('test-server-complete', function() {
        // then test control
        require('./test-control.js')(eve, local, args);
    }).listen('test-control-complete', function() {
        // then test web
        require('./test-web.js')(eve, local, args);
    });

    //install server
    require('./test-server.js')(eve, local, args);
};