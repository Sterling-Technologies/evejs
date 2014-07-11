module.exports = function(eve, local, config) {
	var eden = require('edenjs');
	var exec = require('child_process').exec;
	var paths = config.eve;
	
	eve.trigger('install-web-step-1', eve, local, config);
	
	eden('sequence')

	// 1. Create Folder Structure in [ROOT] -X
	.then(function(next) {
		eden('folder', paths.web)
		.mkdir(0777, function() {
			eve.trigger('install-web-step-2', eve, local, config);
			next();
		});
	})
	
	// 2. Copy [DEV]/build/server folder to [WEB]
	.then(function(next) {
		eden('folder', eve.root + '/build/web')
		.copy(paths.web, function() {
			eve.trigger('install-web-step-3', eve, local, config);
			next();
		});
	})
	
	// 3. Copy [DEV]/config/server folder to [WEB]/config
	.then(function(next) {
		eden('folder', eve.root + '/config/web')
		.copy(paths.web + '/application/config', function() {
			eve.trigger('install-web-step-4', eve, local, config);
			next();
		});
	})
	
	// 4. Copy config to local
	.then(function(next) {
		eden('folder', eve.root + '/config/web')
		.copy(local + '/config/web', function() {
			eve.trigger('install-web-step-5', eve, local, config);
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
				// 5a. Create [VENDOR] in [WEB]/application/package
				subSequence.then(function(folder, subNext) {
					eden('folder', paths.web + '/application/package/' + folder.getName())
						.mkdir(0777, function() {
							subNext();
						});	
				}.bind(this, folders[i]));
				
				// 5b. Loop through each package folder [ROOT]/package/[VENDOR]/[PACKAGE]
				eden('folder', eve.root + '/package/' + folders[i].getName())
				.getFolders(null, false, function(vendor, packages) {
					//console.log(arguments);
					for(var j = 0; j < packages.length; j++) {
						// 5b1. Copy [ROOT]/package/[VENDOR]/[PACKAGE]/web/ to [WEB]/application/package/[VENDOR]/[PACKAGE]
						subSequence.then(function(package, subNext) {
							eden('folder', package.path + '/web')
							.copy(paths.web + '/application/package/' + vendor.getName() + '/' + package.getName(), function() {
								subNext();
							});
						}.bind(this, packages[j]));
						
						// 5b2. Copy [ROOT]/package/[VENDOR]/[PACKAGE]/web/ to local
						subSequence.then(function(package, subNext) {
							eden('folder', package.path + '/control')
							.copy(local + '/package/' + vendor.getName() + '/' + package.getName() + '/web', function() {
								subNext();
							});
						}.bind(this, packages[j]));
					}			
				}.bind(this, folders[i]));
					
			}
			
			//alas
			subSequence.then(function(subNext) {
				eve.trigger('install-web-complete', eve, local, config);
				subNext();
				next();
			});
		});
	});
};