module.exports = function(eve, command) {
	var name 		= command[0] || 'admin',
		exec 		= require('child_process').exec,
		separator	= require('path').sep,
		packages 	= [];
	
	eve
	.setDeployPath('./deploy/' + name)
	.sync(function(next) {
		var settings = this.getSettings();
		
		settings.environments[name] = {
			type: 'admin',
			path: './deploy/' + name,
			lint: {
				globals : {
					define 		: true,
					controller 	: true,
					console 	: true,
					require 	: true,
					Handlebars 	: true
				},
				
				bitwise 		: false,
				strict 			: false,
				browser 		: true,
				jquery 			: true,
				node 			: false,
				maxcomplexity	: 20
			}
		}
		
		this
			.trigger('create-step', 1, 'admin', name)
			.setSettings(settings, next);
	})
	//copy eve/build/admin folder to deploy 
	.then(function(error, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		var source = this.getEvePath() + this.path('/build/admin');
		var destination = this.getDeployPath();
		
		this
			.trigger('create-step', 2, 'admin', name)
			.Folder(source).copy(destination, next);
	})
	//copy eve/config/admin to deploy
	.then(function(error, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		var source = this.getEvePath() + this.path('/config/admin');
		var destination = this.getDeployPath() + this.path('/application/config');
		
		this
			.trigger('create-step', 3, 'admin', name)
			.Folder(source).copy(destination, next);
	})
	//copy eve/config/admin to build
	.then(function(error, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		var source = this.getEvePath() + this.path('/config/admin');
		var destination = this.getBuildPath() + this.path('/config/' + name);
		
		this
			.trigger('create-step', 4, 'admin', name)
			.Folder(source).copy(destination, next);
	})
	//get package folders
	.then(function(error, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		this
			.trigger('create-step', 5, 'server', name)
			.Folder(this.getEvePath() + '/package')
			.getFolders(null, false, next);
	})
	//start to copy package
	.then(function(error, folders, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		packages = folders;
		
		for(var i = 0; i < packages.length; i++) {
			//append the server folder
			packages[i].path += this.path('/admin');
		}
		
		next.thread('copy-package', 0);
	})
	//package loop
	.thread('copy-package', function(i, next) {
		if(i < packages.length) {
			if(!packages[i].isFolder()) {
				next.thread('copy-package', i + 1);	
				return;
			}
			
			next.thread('copy-package-to-deploy', i);
			return;
		}
		
		next();
	})
	.thread('copy-package-to-deploy', function(i, next) {
		// /[EVE_PATH]/package/[PACKAGE]/admin -> [DEPLOY_PATH]/application/package/[PACKAGE]
		var destination = this.getDeployPath() + '/application/package/' 
			+ packages[i].getParent().split(separator).pop(); 
		
		var callback = next.thread.bind(null, 'copy-package-to-build', i);
		packages[i].copy(this.path(destination), callback);
	})
	
	.thread('copy-package-to-build', function(i, error, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		// /[EVE_PATH]/package/[PACKAGE]/admin -> [BUILD_PATH]/package/[PACKAGE]/[NAME]
		var destination = this.getBuildPath() + '/package/' 
			+ packages[i].getParent().split(separator).pop() + '/'
			+ name; 
		
		var callback = next.thread.bind(null, 'next-package', i);
		packages[i].copy(this.path(destination), callback);
	})
	//check for errors and traverse to the next package
	.thread('next-package', function(i, error, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		next.thread('copy-package', i + 1);
	})
	//make a map file
	.then(function(next) {
		//get the deploy path
		var deploy = this.getDeployPath();
		
		//get all the files in the deploy path
		this.Folder(deploy + '/application').getFiles(null, true, function(error, files) {
			//if there's an error
			if(error) {
				//do nothing
				return;
			}
			
			//add files to the map
			for(var map = [], i = 0; i < files.length; i++) {
				map.push(files[i].path.substr(deploy.length));
			}
			
			//set the map
			this.File(deploy + '/application/map.js').setContent('jQuery.eve.map = '+JSON.stringify(map)+';', 
			function(error) {
				next();
			});
		}.bind(this));
	})
	
	//update settings
	.then(function(next) {
		this.setEnvironments(function(error) {
			if(error) {
				this.trigger('error', error);
				return;
			}
			
			next();
		}.bind(this));
	})
	
	//finish up
	.then(function(next) {
		this.trigger('create-complete', 'admin', name);	
		next();
	});
};