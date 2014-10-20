module.exports = function(eve, command) {
	var name 		= command.shift() || 'server',
		exec 		= require('child_process').exec,
		separator	= require('path').sep,
		packages 	= [];
	
	eve
	.setDeployPath('./deploy/' + name)
	.sync(function(next) {
		var settings = this.getSettings();
		
		settings[name] = {
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
			.trigger('install-step', 1, 'server', name)
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
			.trigger('install-step', 2, 'server', name)
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
			.trigger('install-step', 3, 'server', name)
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
			.trigger('install-step', 4, 'server', name)
			.Folder(source).copy(destination, next);
	})
	//get package folders
	.then(function(error, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		this
			.trigger('install-step', 5, 'server', name)
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
	//finish up
	.then(function(next) {
		this.trigger('install-step', 6, 'server', name)
		exec('cd ' + this.getDeployPath() + ' && npm install', function() {
			eve.trigger('install-complete', 'server', name);	
		});
		
		next();
	});
};