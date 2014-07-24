'use strict';

/**
 * Module Dependencies
 */
var spawn = require('child_process').spawn;

/**
 * Properties
 */
var command = process.argv[0];
var mochaBin = __dirname + '/../node_modules/mocha/bin/_mocha';
var mochaProcess;

/**
 * Runs the mocha tester.
 * 
 * @param {Array} mochaArgs
 * @param {Object} opts
 * 
 * @returns {ChildProcess}
 */
exports.run = function(mochaArgs, opts) {
    mochaArgs = mochaArgs || [];
    if (typeof mochaArgs === 'string') {
        mochaArgs = mochaArgs.split(/\s+/);
    }

    mochaArgs.unshift(mochaBin);
    mochaArgs = resolveArgs(mochaArgs);

    exports.kill(); // kill current mocha process
    mochaProcess = spawn(command, mochaArgs, opts);

    return mochaProcess;
};

/**
 * Kills the mocha process.
 * 
 * @returns {Boolean}
 */
exports.kill = function() {
    if (!mochaProcess) {
        return false;
    }

    mochaProcess.kill('SIGKILL');

    return true;
};

/**
 * Checks for know node flags and appends them when found.
 * 
 * @param {Array} args
 * @returns {Array}
 */
function resolveArgs(args) {
    var resolvedArgs = [];

    args.forEach(function(arg) {
        var flag = arg.split('=')[0];

        switch (flag) {
            case '-d':
                resolvedArgs.unshift('--debug');
                break;
            case 'debug':
            case '--debug':
            case '--debug-brk':
                resolvedArgs.unshift(arg);
                break;
            case '-gc':
            case '--expose-gc':
                resolvedArgs.unshift('--expose-gc');
                break;
            case '--gc-global':
            case '--harmony':
            case '--harmony-proxies':
            case '--harmony-collections':
            case '--harmony-generators':
            case '--prof':
                resolvedArgs.unshift(arg);
                break;
            default:
                if (0 === arg.indexOf('--trace'))
                    resolvedArgs.unshift(arg);
                else
                    resolvedArgs.push(arg);
                break;
        }
    });

    return resolvedArgs;
}
