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

// 2. Remove folders and files in [CONTROL]/application/config
.then(function(next) {
	console.log('Removing Control Config ...');
	eden('folder', paths.control + '/application/config')
	.truncate(function() {
		next();
	});
})

// 5. Remove folders and files in [CONTROL]/application/package
.then(function(next) {
	console.log('Removing Control Packages ...');
	eden('folder', paths.control + '/application/package')
	.truncate(function() {
		next();
	});
})

// 8. Copy [DEV]/config/control folder to [CONTROL]/application/config
.then(function(next) {
	console.log('Copying Control Config ...');
	eden('folder', paths.dev + '/config/control')
	.copy(paths.control + '/application/config', function() {
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
			// 10b. Create [VENDOR] in [CONTROL]/application/package
			subSequence.then(function(folder, subNext) {
				eden('folder', paths.control + '/application/package/' + folder.getName())
					.mkdir(0777, function() {
						subNext();
					});	
			}.bind(this, folders[i]));
			
			// 10d. Loop through each package folder [DEV]/package/[VENDOR]/[PACKAGE]
			eden('folder', paths.dev + '/package/' + folders[i].getName())
			.getFolders(null, false, function(vendor, packages) {
				for(var j = 0; j < packages.length; j++) {
					// 10d2. Copy [DEV]/package/[VENDOR]/[PACKAGE]/control/ to [CONTROL]/application/package/[VENDOR]/[PACKAGE]
					subSequence.then(function(package, subNext) {
						eden('folder', package.path + '/control')
						.copy(paths.control + '/application/package/' + vendor.getName() + '/' + package.getName(), function() {
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