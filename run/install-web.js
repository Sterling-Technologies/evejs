module.exports = function(eve, local, args) {
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
			json.web = json.web || {};
			json.web.lint = json.web.lint || {
				globals : {
					define 		: true,
					controller 	: true,
					console 	: true,
					require 	: true,
					Handlebars 	: true
				},
				
				bitwise : false,
				strict 	: false,
				browser : true,
				jquery 	: true,
				node 	: false
			};
			
			var copy = [{
				name 		: 'web',
				description : 'Where should eve deploy web to ? (default: ' + local +'/deploy/web)',
				type 		: 'string' }];
			
			wizard.get(copy, function(error, result) {
				if(error) {
					eve.trigger('error', error);
					return;
				}
				
				deployTo = json.web.path = result.web || local +'/deploy/web';
				  
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
				
				//if there is already a web path
				if(json.web && json.web.path) {
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
		eve.trigger('install-web-step-1', eve, local, deployTo);
		
		eden('folder', deployTo)
		.mkdir(0777, function() {
			eve.trigger('install-web-step-2', eve, local, deployTo);
			next();
		});
	})
	
	// 2. Copy [DEV]/build/server folder to [CONTROL]
	.then(function(next) {
		eden('folder', eve.root + '/build/web')
		.copy(deployTo, function() {
			eve.trigger('install-web-step-3', eve, local, deployTo);
			next();
		});
	})
	
	// 3. Copy [DEV]/config/server folder to [CONTROL]/config
	.then(function(next) {
		eden('folder', eve.root + '/config/web')
		.copy(deployTo + '/application/config', function() {
			eve.trigger('install-web-step-4', eve, local, deployTo);
			next();
		});
	})
	
	// 4. Copy config to caller
	.then(function(next) {
		eden('folder', eve.root + '/config/web')
		.copy(local + '/config/web', function() {
			eve.trigger('install-web-step-5', eve, local, deployTo);
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
					eden('folder', deployTo + '/application/package/' + folder.getName())
						.mkdir(0777, function() {
							subNext();
						});	
				}.bind(this, folders[i]));
				
				// 5b. Loop through each package folder [ROOT]/package/[VENDOR]/[PACKAGE]
				eden('folder', eve.root + '/package/' + folders[i].getName())
				.getFolders(null, false, function(vendor, packages) {
					for(var j = 0; j < packages.length; j++) {
						// 5b1. Copy [ROOT]/package/[VENDOR]/[PACKAGE]/web/ to [CONTROL]/application/package/[VENDOR]/[PACKAGE]
						subSequence.then(function(package, subNext) {
							var deployPackage = deployTo 
								+ '/application/package/' 
								+ vendor.getName() + '/' 
								+ package.getName();
								
							eden('folder', package.path + '/web')
								.copy(deployPackage, function() {
									subNext();
								});
						}.bind(this, packages[j]));
						
						// 5b2. Copy [ROOT]/package/[VENDOR]/[PACKAGE]/web/ to caller
						subSequence.then(function(package, subNext) {
							var localPackage = local 
								+ '/package/' 
								+ vendor.getName() + '/' 
								+ package.getName() 
								+ '/web';
							
							eden('folder', package.path + '/web')
								.copy(localPackage, function() {
									subNext();
								});
						}.bind(this, packages[j]));
					}			
				}.bind(this, folders[i]));
					
			}
			
			//alas
			subSequence.then(function(subNext) {
				eve.trigger('install-web-complete', eve, local, deployTo);
				subNext();
				next();
			});
		});
	});
};