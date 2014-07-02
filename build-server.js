// REQUIRE DEPENDANCIES
var eden = require('./build/server/node_modules/edenjs/lib/index');

//CONFIG
var paths = require('./config');

// GIVEN: Location of environments
//	Defaults:
//		[ROOT]:
//		[DEV]:		
//		[SERVER]: 	[ROOT]/server/current
//		[CONTROL]: 	[ROOT]/control/current
//		[WEB]: 		[ROOT]/web/current

eden('sequence')

// 1. Remove folders and files in [SERVER]/config
.then(function(next) {
	console.log('Removing Server Config ...');
	eden('folder', paths.server + '/config')
	.truncate(function() {
		next();
	});
})

// 4. Remove folders and files in [SERVER]/package
.then(function(next) {
	console.log('Removing Server Packages ...');
	eden('folder', paths.server + '/package')
	.truncate(function() {
		next();
	});
})

// 7. Copy [DEV]/config/server folder to [SERVER]/config
.then(function(next) {
	console.log('Copying Server Config ...');
	eden('folder', paths.dev + '/config/server')
	.copy(paths.server + '/config', function() {
		next();
	});
})

// 10. Loop through each vendor folder [DEV]/package/[VENDOR]
.then(function(next) {
	console.log('Copying Packages ...');
	eden('folder', paths.dev + '/package')
	.getFolders(null, false, function(folders) {
		//make a sub sequence
		var subSequence = eden('sequence');
		
		for(var i = 0; i < folders.length; folders ++) {
			// 10a. Create [VENDOR] in [SERVER]/package
			subSequence.then(function(folder, subNext) {
					eden('folder', paths.server + '/package/' + folder.getName())
						.mkdir(0777, function() {
							subNext();
						});	
				}.bind(this, folders[i]));
			
			// 10d. Loop through each package folder [DEV]/package/[VENDOR]/[PACKAGE]
			eden('folder', paths.dev + '/package/' + folders[i].getName())
			.getFolders(null, false, function(vendor, packages) {
				for(var j = 0; j < packages.length; j++) {
					// 10d1. Copy [DEV]/package/[VENDOR]/[PACKAGE]/server/ to [SERVER]/package/[VENDOR]/[PACKAGE]
					subSequence.then(function(package, subNext) {
						eden('folder', package.path + '/server')
						.copy(paths.server + '/package/' + vendor.getName() + '/' + package.getName(), function() {
							subNext();
						});
					}.bind(this, packages[j]));
				}
			}.bind(this, folders[i]));
			
		}
		
		//alas
		subSequence.then(function(subNext) {
			console.log('Build Complete!');
			next();
			subNext();
		});
	});
});//*/