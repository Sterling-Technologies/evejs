module.exports = function(eve, local, config) {
	var eden = require('edenjs');
	var exec = require('child_process').exec;
	var paths = config.eve;
	
	eve.trigger('install-control-step-1', eve, local, config);
	
	eden('sequence')

	// 1. Create Folder Structure in [ROOT] -X
	.then(function(next) {
		eden('folder', paths.control)
		.mkdir(0777, function() {
			eve.trigger('install-control-step-2', eve, local, config);
			next();
		});
	})
	
	// 2. Copy [DEV]/build/server folder to [CONTROL]
	.then(function(next) {
		eden('folder', eve.root + '/build/control')
		.copy(paths.control, function() {
			eve.trigger('install-control-step-3', eve, local, config);
			next();
		});
	})
	
	// 3. Copy [DEV]/config/server folder to [CONTROL]/config
	.then(function(next) {
		eden('folder', eve.root + '/config/control')
		.copy(paths.control + '/application/config', function() {
			eve.trigger('install-control-step-4', eve, local, config);
			next();
		});
	})
	
	// 4. Copy config to caller
	.then(function(next) {
		eden('folder', eve.root + '/config/control')
		.copy(local + '/config/control', function() {
			eve.trigger('install-control-step-5', eve, local, config);
			next();
		});
	})
	
	// 5. Loop through each vendor folder [ROOT]/package/[VENDOR]
	.then(function(next) {
		eden('folder', eve.root + '/package')
		.getFolders(null, false, function(folders) {
			//make a sub sequence
			var subSequence = eden('sequence');
			
			for(var i = 0; i < folders.length; folders ++) {
				// 5a. Create [VENDOR] in [CONTROL]/application/package
				subSequence.then(function(folder, subNext) {
					eden('folder', paths.control + '/application/package/' + folder.getName())
						.mkdir(0777, function() {
							subNext();
						});	
				}.bind(this, folders[i]));
				
				// 5b. Loop through each package folder [ROOT]/package/[VENDOR]/[PACKAGE]
				eden('folder', eve.root + '/package/' + folders[i].getName())
				.getFolders(null, false, function(vendor, packages) {
					for(var j = 0; j < packages.length; j++) {
						// 5b1. Copy [ROOT]/package/[VENDOR]/[PACKAGE]/control/ to [CONTROL]/application/package/[VENDOR]/[PACKAGE]
						subSequence.then(function(package, subNext) {
							eden('folder', package.path + '/control')
							.copy(paths.control + '/application/package/' + vendor.getName() + '/' + package.getName(), function() {
								subNext();
							});
						}.bind(this, packages[j]));
						
						// 5b2. Copy [ROOT]/package/[VENDOR]/[PACKAGE]/control/ to caller
						subSequence.then(function(package, subNext) {
							eden('folder', package.path + '/control')
							.copy(local + '/package/' + vendor.getName() + '/' + package.getName() + '/control', function() {
								subNext();
							});
						}.bind(this, packages[j]));
					}			
				}.bind(this, folders[i]));
					
			}
			
			//alas
			subSequence.then(function(subNext) {
				eve.trigger('install-control-complete', eve, local, config);
				subNext();
				next();
			});
		});
	});
};