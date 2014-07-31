module.exports = function(eve, local, args) {
	//---------------------------------------
	// START: VARIABLE LIST
	
	var settings = {
		eve			: eve,
		local		: local,
		args		: args,
		eden		: require('edenjs'),
		parameter 	: args[0],
		packages 	: [],
		config		: {},
		vendor 		: {},
	
		paths : {
			control     : local + '/config/control/packages.js',
			server      : local + '/config/server/packages.js',
			schema      : local + '/schema/',
			package     : local + '/package/',
			generator   : __dirname + '/../../build/generator/' }
	}, sequence = settings.eden('sequence');
	
	settings.copy = {
		field 	: require(settings.paths.generator + '/field.js'),
		valid 	: require(settings.paths.generator + '/valid.js'),
		slug 	: require(settings.paths.generator + '/slug.js'),
		active 	: require(settings.paths.generator + '/active.js'),
		created : require(settings.paths.generator + '/created.js'),
		updated : require(settings.paths.generator + '/updated.js'),
	};
	
	// END: VARIABLE LIST
	//---------------------------------------
	sequence.then(function(next) { next(settings); });
	//---------------------------------------
	// START: VALIDATION
	
	sequence.then(require(__dirname + '/../generate/validation'));

	// END: VALIDATION
	//---------------------------------------

	//---------------------------------------
	// START: GET DEPLOY PATH

	sequence.then(require(__dirname + '/../generate/get-paths'));

	// END: GET DEPLOY PATH
	//---------------------------------------

	//---------------------------------------
	// START: DETERMINE PACKAGES

	sequence.then(require(__dirname + '/../generate/get-packages'));

	// END: DETERMINE PACKAGES
	//---------------------------------------

	//---------------------------------------
	// START: VALIDATE PACKAGES

	sequence.then(require(__dirname + '/../generate/validate-packages'));

	// END: VALIDATE PACKAGES
	//---------------------------------------

	//---------------------------------------
	// START: GENERATE PACKAGES

	sequence.then(require(__dirname + '/../generate/generate-packages'));

	// END: GENERATE PACKAGES
	//---------------------------------------
};