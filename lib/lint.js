'use strict';

/**
 * Module Dependencies
 */
var JSHINT = require('jshint').JSHINT;
var eden = require('edenjs');

/**
 * Local Properties
 */
var DEFAULTS = {
    CONFIG : {
        // enforcing
        bitwise 		: true,    	camelcase 		: true,
        curly 			: true,    	eqeqeq 			: true,
        es3 			: false,   	forin 			: true,
        freeze 			: true,    	immed 			: true,
        indent 			: 1,    	latedef 		: false,
        laxbreak 		: true,    	newcap 			: false,
        noarg 			: true,    	noempty 		: true,
        nonbsp 			: true,    	nonew 			: true,
        plusplus 		: false,   	quotmark 		: false,
        undef 			: true,    	unused 			: true,
        strict 			: true,     maxparams 		: 0,
        maxdepth 		: 10,     	maxstatements 	: 0,
        maxcomplexity 	: 10,   	maxlen 			: 0,
        // relaxing
        sub 			: true,
        // environtment
        browser 		: false,  	couch 			: false,
        devel 			: false,    dojo 			: false,
        jquery 			: false,    mootools 		: false,
        node 			: true,     nonstandard 	: false,
        phantom 		: false,    prototypejs 	: false,
        rhino 			: false,    worker 			: false,
        wsh 			: false,    yui 			: false },
    REPORTER : {
        HEADER 				: '\x1b[31m\x1b[4m%s\x1b[0m\x1b[0m',
        DETAIL 				: '  \x1b[2mline %s\x1b[0m  \x1b[2mcol %s\x1b[0m' +
                			  '  \x1b[36m%s\x1b[0m',
        TOTAL_ERROR_COUNT 	: '\x1b[31mTotal # of Errors: %s\x1b[0m',
        NO_ERROR 			: '\x1b[32mNo errors found\x1b[0m'
    }
};

/**
 * Runs JSHint against provided file and saves the result.
 *
 * @param {String} code code that needs to be linted
 * @param {Array} results a pointer to an object with results
 * @param {Object} config an object with JSHint configuration
 * @param {Object} data a pointer to an object with extra data
 * @param {String} file (Optional) file name that is being linted
 */
var lint = function(code, results, config, data, file) {
    var globals, lintData, buffer = [];
	
	config = eden('hash').merge(DEFAULTS.CONFIG, config || {});
    config = JSON.parse(JSON.stringify(config));

    if (config.globals) {
        globals = config.globals;
        delete config.globals;
    }

    buffer.push(code);
    buffer = buffer.join('\n');
    buffer = buffer.replace(/^\uFEFF/, ''); // Remove potential Unicode BOM.

    if (!JSHINT(buffer, config, globals)) {
        JSHINT.errors.forEach(function(error) {
			if (!error) {
				return;
			}
	
			results.push({ file: file || 'stdin', error: error });
		});
    }

    lintData = JSHINT.data();

    if (lintData) {
        lintData.file = file || 'stdin';
        data.push(lintData);
    }
};

/**
 * Default reporter.
 * 
 * @param {Array} results the results to be reported
 */
var defaultReporter = function(results) {
    var paths = {};
    var totalErrors = 0;

    results.forEach(function(result) {
        var file = result.file;
        var error = result.error;

        if (!paths.hasOwnProperty(file)) {
            paths[file] = [];
        }

        paths[file].push(error);
    });

    var file, 
		eachCallback = function(error) {
			console.log(DEFAULTS.REPORTER.DETAIL, error.line, error.character,
					error.reason);
	
			totalErrors++;
		};
	
    for (file in paths) {
        if (paths.hasOwnProperty(file)) {
            console.log(DEFAULTS.REPORTER.HEADER, file);

            paths[file].forEach(eachCallback);
        }
    }

    if (totalErrors) {
        console.log(DEFAULTS.REPORTER.TOTAL_ERROR_COUNT, totalErrors);
    } else {
        console.log(DEFAULTS.REPORTER.NO_ERROR);
    }
};

/**
 * Run the eve JSHint.
 * 
 * @param {String} code code that needs to be linted
 * @param {Object} config (Optional) an object with JSHint configuration
 * @param {String} file (Optional) file name that is being linted
 * @returns {Boolean} returns true if the code is valid
 */
module.exports = function(code, config, file) {
    var results 	= [];
    var data 		= [];
    var reporter;
	
    config = config || {};

    if(config.reporter) {
        reporter = config.reporter;
        delete config.reporter;
    }

    lint(code.toString(), results, config, data, file);

    (reporter || defaultReporter)(results, data, { verbose : config.verbose });

    return results.length === 0;
};