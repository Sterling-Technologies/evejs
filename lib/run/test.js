'use strict';

/**
 * Module Dependencies
 */
var eden = require('edenjs');

/**
 * Calls the specified test module.
 * 
 * @param {Eve} eve
 * @param {String} local
 * @param {Array} args
 */
module.exports = function(eve, local, args) {
    // just let the files be responsible for the actions if it exists
    var section = args[0] || 'all';

    // first check for the file
    var script = __dirname + '/test-' + section + '.js';

    // if this is not a file
    if (!eden('file', script).isFile()) {
        //give an error and return
        eve.trigger('error', 'Test: This is not a valid command', local);
        return;
    }

    eve.trigger('test-' + section, local);

    // prepare the arguments
    args = Array.prototype.slice.apply(args);

    args.shift();

    // require the file and let it do the rest
    require(script)(eve, local, args);
};