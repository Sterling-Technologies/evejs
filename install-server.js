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

// 1. Create Folder Structure in [ROOT] -X
.then(function(next) {
	console.log('Creating Server Folder ...');
	eden('folder', paths.server)
	.mkdir(0777, function() {
		next();
	});
})

// 2. Copy [DEV]/build/server folder to [SERVER]
.then(function(next) {
	console.log('Copying Server Files ...');
	eden('folder', paths.dev + '/build/server')
	.copy(paths.server, function() {
		next();
	});
})
// 5. Copy [DEV]/config/server folder to [SERVER]/config
.then(function(next) {
	console.log('Copying Server Config ...');
	eden('folder', paths.dev + '/config/server')
	.copy(paths.server + '/config', function() {
		next();
	});
})

// 8. Loop through each vendor folder [DEV]/package/[VENDOR]
.then(function(next) {
	console.log('Copying Packages ...');
	eden('folder', paths.dev + '/package')
	.getFolders(null, false, function(folders) {
		//make a sub sequence
		var subSequence = eden('sequence');
		
		for(var i = 0; i < folders.length; folders ++) {
			// 8a. Create [VENDOR] in [SERVER]/package
			subSequence.then(function(folder, subNext) {
				eden('folder', paths.server + '/package/' + folder.getName())
					.mkdir(0777, function() {
						subNext();
					});	
			}.bind(this, folders[i]));
			
			// 8d. Loop through each package folder [DEV]/package/[VENDOR]/[PACKAGE]
			eden('folder', paths.dev + '/package/' + folders[i].getName())
			.getFolders(null, false, function(vendor, packages) {
				//console.log(arguments);
				for(var j = 0; j < packages.length; j++) {
					// 8d1. Copy [DEV]/package/[VENDOR]/[PACKAGE]/server/ to [SERVER]/package/[VENDOR]/[PACKAGE]
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
			console.log('Installation Complete!');
			next();
			subNext();
		});
	});
})