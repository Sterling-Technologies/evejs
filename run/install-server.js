module.exports = function(eve, local, config) {
	var eden = require('edenjs');
	var exec = require('child_process').exec;
	var paths = config.eve;
	
	eve.trigger('install-server-step-1', eve, local, config);
	
	eden('sequence')

	// 1. Create Folder Structure in [ROOT] -X
	.then(function(next) {
		eden('folder', paths.server)
		.mkdir(0777, function() {
			eve.trigger('install-server-step-2', eve, local, config);
			next();
		});
	})
	
	// 2. Copy [DEV]/build/server folder to [SERVER]
	.then(function(next) {
		eden('folder', eve.root + '/build/server')
		.copy(paths.server, function() {
			eve.trigger('install-server-step-3', eve, local, config);
			next();
		});
	})
	
	// 3. Copy [DEV]/config/server folder to [SERVER]/config
	.then(function(next) {
		eden('folder', eve.root + '/config/server')
		.copy(paths.server + '/config', function() {
			eve.trigger('install-server-step-4', eve, local, config);
			next();
		});
	})
	
	// 4. Copy config to local
	.then(function(next) {
		eden('folder', eve.root + '/config/server')
		.copy(local + '/config/server', function() {
			eve.trigger('install-server-step-5', eve, local, config);
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
				// 5a. Create [VENDOR] in [SERVER]/package
				subSequence.then(function(folder, subNext) {
					eden('folder', paths.server + '/package/' + folder.getName())
						.mkdir(0777, function() {
							subNext();
						});	
				}.bind(this, folders[i]));
				
				// 5b. Loop through each package folder [ROOT]/package/[VENDOR]/[PACKAGE]
				eden('folder', eve.root + '/package/' + folders[i].getName())
				.getFolders(null, false, function(vendor, packages) {
					for(var j = 0; j < packages.length; j++) {
						// 5b1. Copy [ROOT]/package/[VENDOR]/[PACKAGE]/server/ to [SERVER]/package/[VENDOR]/[PACKAGE]
						subSequence.then(function(package, subNext) {
							eden('folder', package.path + '/server')
							.copy(paths.server + '/package/' + vendor.getName() + '/' + package.getName(), function() {
								subNext();
							});
						}.bind(this, packages[j]));
						
						// 5b2. Copy [ROOT]/package/[VENDOR]/[PACKAGE]/server/ to local
						subSequence.then(function(package, subNext) {
							eden('folder', package.path + '/server')
							.copy(local + '/package/' + vendor.getName() + '/' + package.getName() + '/server', function() {
								subNext();
							});
						}.bind(this, packages[j]));
					}			
				}.bind(this, folders[i]));
					
			}
			
			//npm install
			subSequence.then(function(subNext) {
				eve.trigger('install-server-step-6', eve, local, config);
				exec('cd ' + paths.server + ' && npm install', subNext);
			});
			
			//alas
			subSequence.then(function(error, stdout, stderr, subNext) {
				if(error) {
					eve.trigger('error', error);
					return;
				}
				
				eve.trigger('install-server-complete', eve, local, config);
				subNext();
				next();
			});
		});
	});
};