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
			json.control = json.control || {};
			json.control.lint = json.control.lint || {
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
                        json.control.lint_mocha = json.control.lint_mocha || {
				bitwise : false,
				strict 	: false,
				browser : true,
				jquery 	: true,
				node 	: false,
				globals : {
					define 	   : true,
					controller : true,
					console    : true,
					require    : true,
					Handlebars : true,
					describe   : true,
					it         : true,
					before     : true,
					beforeEach : true,
					after      : true,
					afterEach  : true
                                }
			};
			json.control.mocha = '--reporter list --recursive';
			
			var copy = [{
				name 		: 'control',
				description : 'Where should eve deploy control to ? (default: ' + local +'/deploy/control)',
				type 		: 'string' }];
			
			wizard.get(copy, function(error, result) {
				if(error) {
					eve.trigger('error', error);
					return;
				}
				
				deployTo = json.control.path = result.control || local +'/deploy/control';
				  
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
		eve.trigger('install-control-step-1', eve, local, deployTo);
		
		eden('folder', deployTo)
		.mkdir(0777, function() {
			eve.trigger('install-control-step-2', eve, local, deployTo);
			next();
		});
	})
	
	// 2. Copy [DEV]/build/control folder to [CONTROL]
	.then(function(next) {
		eden('folder', eve.root + '/build/control')
		.copy(deployTo, function() {
			eve.trigger('install-control-step-3', eve, local, deployTo);
			next();
		});
	})
	
	// 3. Copy [DEV]/config/control folder to [CONTROL]/config
	.then(function(next) {
		eden('folder', eve.root + '/config/control')
		.copy(deployTo + '/application/config', function() {
			eve.trigger('install-control-step-4', eve, local, deployTo);
			next();
		});
	})
	
	// 4. Copy config to caller
	.then(function(next) {
		eden('folder', eve.root + '/config/control')
		.copy(local + '/config/control', function() {
			eve.trigger('install-control-step-5', eve, local, deployTo);
			next();
		});
	})
	
	.then(function(next) {
		eden('folder', eve.root + '/package').getFolders(null, false, next);
	})
	
	.then(function(vendors, next) {
		//make a sub sequence
		var sequence2 = eden('sequence');
		
		eden('array').each(vendors, function(i, vendor) {
			// 5a. Create [VENDOR] in [CONTROL]/application/package
			sequence2.then(function(next2) {
				var path = deployTo + '/application/package/' + vendor.getName();
				
				eden('folder', path).mkdir(0777, function() {
					next2();
				});	
			}).then(function(next2) {
				var path = eve.root + '/package/' + vendor.getName();
				
				eden('folder', path).getFolders(null, false, next2);
			// 5b. Loop through each package folder [ROOT]/package/[VENDOR]/[PACKAGE]
			}).then(function(packages, next2) {
				//make a sub sequence
				var sequence3 = eden('sequence');
				
				eden('array').each(packages, function(i, package) {
					// 5b1. Copy [ROOT]/package/[VENDOR]/[PACKAGE]/control/ to [CONTROL]/application/package/[VENDOR]/[PACKAGE]
					sequence3.then(function(next3) {
						var source = package.path + '/control';
						var destination = deployTo 
							+ '/application/package/' 
							+ vendor.getName() + '/' 
							+ package.getName();
							
						eden('folder', source).copy(destination, function() {
							next3();
						});
					// 5b2. Copy [ROOT]/package/[VENDOR]/[PACKAGE]/control/ to caller
					}).then(function(next3) {
						var source = package.path + '/control';
						var destination = local 
							+ '/package/' 
							+ vendor.getName() + '/' 
							+ package.getName() 
							+ '/control';
							
						eden('folder', source).copy(destination, function() {
							next3();
						});
					});
				});
				
				//we are done with sequence 3
				sequence3.then(function() {
					//call next 2
					next2();
				});
			});
		});
		
		//we are done with sequence 2
		sequence2.then(function() {
			//call next 
			next();
		});
	})
	
	//alas
	.then(function() {
		eve.trigger('install-control-complete', eve, local, deployTo);
	});
};