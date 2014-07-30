module.exports = function(eve, local, args) {
	//---------------------------------------
	// START: VARIABLE LIST

	var eden		= require('edenjs');
	var sequence	= eden('sequence');
	var parameter 	= args[0];
	var packages 	= [];
	var settings	= {};
	var vendor 		= {};

    var paths = {
        control     : local + '/config/control/packages.js',
        server      : local + '/config/server/packages.js',
        schema      : local + '/schema/',
        package     : local + '/package/',
        generator   : __dirname + '/../../build/generator/' };

	var copy = {
		field 	: require(paths.generator + '/field.js'),
		valid 	: require(paths.generator + '/valid.js'),
		slug 	: require(paths.generator + '/slug.js'),
		active 	: require(paths.generator + '/active.js'),
		created : require(paths.generator + '/created.js'),
		updated : require(paths.generator + '/updated.js'),
	};

	// END: VARIABLE LIST
	//---------------------------------------

	//---------------------------------------
	// START: VALIDATION

	sequence.then(require(__dirname + '/../generate/validation').bind(null, eden, eve, paths, parameter));

	// END: VALIDATION
	//---------------------------------------

	//---------------------------------------
	// START: GET DEPLOY PATH

	sequence.then(require(__dirname + '/../generate/get-paths').bind(null, eden, local));

	sequence.then(require(__dirname + '/../generate/set-paths').bind(null, eve, settings));

	// END: GET DEPLOY PATH
	//---------------------------------------

	//---------------------------------------
	// START: DETERMINE PACKAGES

	sequence.then(require(__dirname + '/../generate/get-packages').bind(null, eden, eve, packages, vendor, parameter, paths));

	sequence.then(require(__dirname + '/../generate/set-packages').bind(null, eden, packages));

	// END: DETERMINE PACKAGES
	//---------------------------------------

	//---------------------------------------
	// START: VALIDATE PACKAGES

	sequence.then(require(__dirname + '/../generate/validate-packages')
		.bind(null, eden, eve, packages, paths, vendor));

	// END: VALIDATE PACKAGES
	//---------------------------------------

	//---------------------------------------
	// START: GENERATE PACKAGES

	sequence.then(require(__dirname + '/../generate/generate-packages')
		.bind(null, eden, eve, parameter, packages, settings, vendor, paths, copy));

	// END: GENERATE PACKAGES
	//---------------------------------------
};