module.exports = function(eve, local, config) {
	var eden 	= require('edenjs');
	var wizard 	= require('prompt');
	var exec 	= require('child_process').exec;
	
	var deployTo = null;
	
	eden('sequence')

	//get paths
	.then(function(next) {
		var settings = eden('file', local + '/build.json');
		
		var setPath = function(settings, next, json) {
			json = json || {};
			json.server = json.server || {};
			json.server.lint = json.server.lint || {
				bitwise : false,
				strict 	: false,
				node 	: true
			};
			
			var copy = [{
				name 		: 'server',
				description : 'Where should eve deploy server to ? (default: ' + local +'/deploy/server)',
				type 		: 'string' }];
			
			wizard.get(copy, function(error, result) {
				if(error) {
					eve.trigger('error', error);
					return;
				}
				
				deployTo = json.server.path = result.server || local +'/deploy/server';
				  
				//write this to settings
				settings.setContent(JSON.stringify(json, null, 4), function(error) {
					if(error) {
						eve.trigger('error', error);
					}	
					
					next();
				});
			});
		};
		
		//if this is a file
		if(settings.isFile()) {
			settings.getContent(function(error, content) {
				if(error) {
					eve.trigger('error', error);
					return;
				}
				
				var json = JSON.parse(content);	
				
				//if there is already a control path
				if(json.control && json.control.path) {
					deployTo = json.control.path;
					//goto next
					next();
					return;
				}
				
				//at this point there is no settings
				//we need to prompt for the path
				setPath(settings, next, json);
			});
			
			return;
		}
		
		//this is not a file
		//we need to prompt for the path
		setPath(settings, next);
	})
	
	// 1. Create Folder Structure in [ROOT] -X
	.then(function(next) {
		eve.trigger('install-server-step-1', eve, local, deployTo);
		
		eden('folder', deployTo)
		.mkdir(0777, function() {
			eve.trigger('install-server-step-2', eve, local, deployTo);
			next();
		});
	})
	
	// 2. Copy [DEV]/build/server folder to [SERVER]
	.then(function(next) {
		eden('folder', eve.root + '/build/server')
		.copy(deployTo, function() {
			eve.trigger('install-server-step-3', eve, local, deployTo);
			next();
		});
	})
	
	// 3. Copy [DEV]/config/server folder to [SERVER]/config
	.then(function(next) {
		eden('folder', eve.root + '/config/server')
		.copy(deployTo + '/config', function() {
			eve.trigger('install-server-step-4', eve, local, deployTo);
			next();
		});
	})
	
	// 4. Copy config to local
	.then(function(next) {
		eden('folder', eve.root + '/config/server')
		.copy(local + '/config/server', function() {
			eve.trigger('install-server-step-5', eve, local, deployTo);
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
					eden('folder', deployTo + '/package/' + folder.getName())
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
							var deployPackage = deployTo 
								+ '/package/' 
								+ vendor.getName() + '/' 
								+ package.getName();
							
							eden('folder', package.path + '/server')
							.copy(deployPackage, function() {
								subNext();
							});
						}.bind(this, packages[j]));
						
						// 5b2. Copy [ROOT]/package/[VENDOR]/[PACKAGE]/server/ to local
						subSequence.then(function(package, subNext) {
							var localPackage = local 
								+ '/package/' 
								+ vendor.getName() + '/' 
								+ package.getName() 
								+ '/server';
							
							eden('folder', package.path + '/server')
							.copy(localPackage, function() {
								subNext();
							});
						}.bind(this, packages[j]));
					}			
				}.bind(this, folders[i]));
					
			}
			
			//npm install
			subSequence.then(function(subNext) {
				eve.trigger('install-server-step-6', eve, local, deployTo);
				exec('cd ' + deployTo + ' && npm install', subNext);
			});
			
			//alas
			subSequence.then(function(error, stdout, stderr, subNext) {
				if(error) {
					eve.trigger('error', error);
					return;
				}
				
				eve.trigger('install-server-complete', eve, local, deployTo);
				subNext();
				next();
			});
		});
	});
};