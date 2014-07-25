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
			json.server.lint_mocha = json.server.lint_mocha || {
				bitwise : false,
				strict 	: false,
				node 	: true,
				globals : {
					describe   : true,
					it         : true,
					before     : true,
					beforeEach : true,
					after      : true,
					afterEach  : true
                                }
			};
			json.server.mocha = '--reporter list --recursive';
			json.server.nodemon = { ignore: ['test/'] };

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
				
				//if there is already a server path
				if(json.server && json.server.path) {
					deployTo = json.server.path;
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
	
	.then(function(next) {
		eden('folder', eve.root + '/package').getFolders(null, false, next);
	})
	
	.then(function(vendors, next) {
		//make a sub sequence
		var sequence2 = eden('sequence');
		
		eden('array').each(vendors, function(i, vendor) {
			// 5a. Create [VENDOR] in [CONTROL]/application/package
			sequence2.then(function(next2) {
				var path = deployTo + '/package/' + vendor.getName();
				
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
					// 5b1. Copy [ROOT]/package/[VENDOR]/[PACKAGE]/server/ to [SERVER]/package/[VENDOR]/[PACKAGE]
					sequence3.then(function(next3) {
						var source = package.path + '/server';
						var destination = deployTo 
							+ '/package/' 
							+ vendor.getName() + '/' 
							+ package.getName();
							
						eden('folder', source).copy(destination, function() {
							next3();
						});
					// 5b2. Copy [ROOT]/package/[VENDOR]/[PACKAGE]/server/ to caller
					}).then(function(next3) {
						var source = package.path + '/server';
						var destination = local 
							+ '/package/' 
							+ vendor.getName() + '/' 
							+ package.getName() 
							+ '/server';
							
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
	
	//npm install
	.then(function(next) {
		eve.trigger('install-server-step-6', eve, local, deployTo);
		exec('cd ' + deployTo + ' && npm install', next);
	})
	
	//alas
	.then(function() {
		eve.trigger('install-server-complete', eve, local, deployTo);
	});
};