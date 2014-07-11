/**
 * Module Dependencies
 */
var JSHINT = require('jshint').JSHINT;

/**
 * Local Properties
 */
var DEFAULTS = {
    CONFIG : {
        // enforcing
        bitwise : true,
        camelcase : true,
        curly : true,
        eqeqeq : true,
        es3 : false,
        forin : true,
        freeze : true,
        immed : true,
        indent : 1,
        latedef : false,
        newcap : true,
        noarg : true,
        noempty : true,
        nonbsp : true,
        nonew : true,
        plusplus : false,
        quotmark : false,
        undef : true,
        unused : true,
        strict : true,
        maxparams : 0,
        maxdepth : 10,
        maxstatements : 0,
        maxcomplexity : true,
        maxlen : 0,
        // relaxing
        sub : true,
        // environtment
        browser : false,
        couch : false,
        devel : false,
        dojo : false,
        jquery : false,
        mootools : false,
        node : true, // default environment
        nonstandard : false,
        phantom : false,
        prototypejs : false,
        rhino : false,
        worker : false,
        wsh : false,
        yui : false
    },
    REPORTER : {
        HEADER : '\x1b[31m\x1b[4m%s\x1b[0m\x1b[0m',
        DETAIL : '  \x1b[2mline %s\x1b[0m  \x1b[2mcol %s\x1b[0m'
                + '  \x1b[36m%s\x1b[0m'
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
function lint(code, results, config, data, file) {
    var defaultConfig = JSON.parse(JSON.stringify(DEFAULTS.CONFIG));
    var globals;
    var lintData;
    var buf = [];

    extend(defaultConfig, config || { });

    config = defaultConfig;
    config = JSON.parse(JSON.stringify(config));

    if (config.globals) {
        globals = config.globals;
        delete config.globals;
    }

    buf.push(code);
    buf = buf.join('\n');
    buf = buf.replace(/^\uFEFF/, ''); // Remove potential Unicode BOM.

    if (!JSHINT(buf, config, globals)) {
        JSHINT.errors.forEach(function(err) {
            if (err) {
                results.push({ file : file || 'stdin', error : err });
            }
        });
    }

    lintData = JSHINT.data();

    if (lintData) {
        lintData.file = file || 'stdin';
        data.push(lintData);
    }
}

/**
 * Default reporter.
 * 
 * @param {Array} results the results to be reported
 * @param {Array} data extra data from results
 */
function defaultReporter(results, data) {
    var paths = { };

    results.forEach(function(result) {
        var file = result.file;
        var error = result.error;

        if (!paths.hasOwnProperty(file)) {
            paths[file] = [];
        }

        paths[file].push(error);
    });

    var file;
    for (file in paths) {
        console.log(DEFAULTS.REPORTER.HEADER, file);

        paths[file].forEach(function(error) {
            console.log(DEFAULTS.REPORTER.DETAIL, error.line, error.character,
                    error.reason);
        });
    }
}

/**
 * Extends the obj1 properties from obj2 properties.
 * 
 * @param {Object} obj1
 * @param {Object} obj2
 */
function extend(obj1, obj2) {
    var idx;
    for (idx in obj2) {
        obj1[idx] = obj2[idx];
    }
}

/**
 * Run the eve JSHint.
 * 
 * @param {String} code code that needs to be linted
 * @param {Object} config (Optional) an object with JSHint configuration
 * @param {String} file (Optional) file name that is being linted
 * @returns {Boolean} returns true if the code is valid
 */
module.exports = function(code, config, file) {
    var results = [];
    var data = [];
    var reporter;
    config = config || { };

    if (config.reporter) {
        reporter = config.reporter;
        delete config.reporter;
    }

    lint(code.toString(), results, config, data, file);

    (reporter || defaultReporter)(results, data, { verbose : config.verbose });

    return results.length === 0;
};