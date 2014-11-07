module.exports = function(eve, command) {
	var name 		= command[0] || 'server',
		exec 		= require('child_process').exec,
		separator	= require('path').sep,
		packages 	= [];
	
	eve
	.setDeployPath('./deploy/' + name)
	.sync(function(next) {
		var settings = this.getSettings();
		
		settings.environments[name] = {
			type: 'server',
			path: './deploy/' + name,
			lint: {
				bitwise 		: false,
				strict 			: false,
				node 			: true,
				maxcomplexity	: 20
			}
		}
		
		this
			.trigger('create-step', 1, 'server', name)
			.setSettings(settings, next);
	})
	//copy eve/build/server folder to deploy 
	.then(function(error, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		var source = this.getEvePath() + this.path('/build/server');
		var destination = this.getDeployPath();
		
		this
			.trigger('create-step', 2, 'server', name)
			.Folder(source).copy(destination, next);
	})
	//copy eve/config/server to deploy
	.then(function(error, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		var source = this.getEvePath() + this.path('/config/server');
		var destination = this.getDeployPath() + this.path('/config');
		
		this
			.trigger('create-step', 3, 'server', name)
			.Folder(source).copy(destination, next);
	})
	//copy eve/config/server to build
	.then(function(error, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		var source = this.getEvePath() + this.path('/config/server');
		var destination = this.getBuildPath() + this.path('/config/' + name);
		
		this
			.trigger('create-step', 4, 'server', name)
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
			packages[i].path += this.path('/server');
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
		// /[EVE_PATH]/package/[PACKAGE]/server -> [DEPLOY_PATH]/package/[PACKAGE]
		var destination = this.getDeployPath() + '/package/' 
			+ packages[i].getParent().split(separator).pop(); 
		
		var callback = next.thread.bind(null, 'copy-package-to-build', i);
		packages[i].copy(this.path(destination), callback);
	})
	
	.thread('copy-package-to-build', function(i, error, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		// /[EVE_PATH]/package/[PACKAGE]/server -> [BUILD_PATH]/package/[PACKAGE]/[NAME]
		var destination = this.getBuildPath() + '/package/' 
			+ packages[i].getParent().split(separator).pop() + '/'
			+ name; 
		
		var callback = next.thread.bind(null, 'copy-package-schema', i);
		packages[i].copy(this.path(destination), callback);
	})
	
	.thread('copy-package-schema', function(i, error, next) {
		var source = this.File(packages[i].getParent() + '/schema.json');
		
		var destination = this.File(this.getBuildPath() + '/package/' 
			+ packages[i].getParent().split(separator).pop() 
			+ '/schema.json');
		
		//if there is no source file or there is already a destination
		if(!source.isFile() || destination.isFile()) {
			next.thread('install-package', i);
			return;
		}
		
		//copy the file
		source.copy(destination.path, function(error) {
			if(error) {
				this.trigger('error', error);
				return;
			}
			
			next.thread('install-package', i);
		}.bind(this));
	})
	
	.thread('install-package', function(i, next) {
		var source = this.File(packages[i].getParent() + '/install.js');
		
		var destination = this.File(this.getBuildPath() + '/package/' 
			+ packages[i].getParent().split(separator).pop() 
			+ '/install.js');
		
		//if there is no install file or there is already an install
		if(!source.isFile() || destination.isFile()) {
			next.thread('next-package', i, null);
			return;
		}
		
		//copy the file
		source.copy(destination.path, function(error) {
			if(error) {
				this.trigger('error', error);
				return;
			}
			
			//what is the database?
			var database = this.getDatabase();
			
			var callback = next.thread.bind(null, 'next-package', i);
			require(source.path)(database, callback);
		}.bind(this));
	})
	
	//check for errors and traverse to the next package
	.thread('next-package', function(i, error, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		next.thread('copy-package', i + 1);
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
		this.trigger('create-step', 6, 'server', name);
		
		exec('cd ' + this.getDeployPath() + ' && npm install', function() {
			eve.trigger('create-complete', 'server', name);	
		});
		
		next();
	});
};