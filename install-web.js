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

.then(function(next) {
	console.log('Creating Web Folder ...');
	eden('folder', paths.web)
	.mkdir(0777, function() {
		next();
	});
})

// 4. Copy [DEV]/build/web folder to [WEB]
.then(function(next) {
	console.log('Copying Web Files ...');
	eden('folder', paths.dev + '/build/web')
	.copy(paths.web, function() {
		next();
	});
})

// 7. Copy [DEV]/config/web folder to [WEB]/application/config
.then(function(next) {
	console.log('Copying Web Config ...');
	eden('folder', paths.dev + '/config/web')
	.copy(paths.web + '/application/config', function() {
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
			// 8c. Create [VENDOR] in [WEB]/applicaiton/package
			subSequence.then(function(folder, subNext) {
				eden('folder', paths.web + '/application/package/' + folder.getName())
					.mkdir(0777, function() {
						subNext();
					});	
			}.bind(this, folders[i]));

			// 8d. Loop through each package folder [DEV]/package/[VENDOR]/[PACKAGE]
			eden('folder', paths.dev + '/package/' + folders[i].getName())
			.getFolders(null, false, function(vendor, packages) {
				//console.log(arguments);
				for(var j = 0; j < packages.length; j++) {
					// 8d3. Copy [DEV]/package/[VENDOR]/[PACKAGE]/web/ to [WEB]/application/package/[VENDOR]/[PACKAGE]	
					subSequence.then(function(package, subNext) {
						eden('folder', package.path + '/web')
						.copy(paths.web + '/application/package/' + vendor.getName() + '/' + package.getName(), function() {
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