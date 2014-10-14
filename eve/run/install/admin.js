module.exports = function(eve, command) {
	var name 		= command.shift() || 'admin',
		exec 		= require('child_process').exec,
		separator	= require('path').sep,
		vendors 	= [];
	
	eve
	.setDeployPath('./deploy/' + name)
	.sync(function(next) {
		var settings = this.getSettings();
		
		settings[name] = {
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
			.trigger('install-step', 1, 'admin', name)
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
			.trigger('install-step', 2, 'admin', name)
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
			.trigger('install-step', 3, 'admin', name)
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
			.trigger('install-step', 4, 'admin', name)
			.Folder(source).copy(destination, next);
	})
	//get vendor folders
	.then(function(error, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		this
			.trigger('install-step', 5, 'admin', name)
			.Folder(this.getEvePath() + '/package')
			.getFolders(null, false, next);
	})
	//for each vendor copy package
	.then(function(error, folders, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		vendors = folders;
		next.thread('copy-vendor', 0);
	})
	//copy vendor
	.thread('copy-vendor', function(i, next) {
		if(i < vendors.length) {
			//get folders
			var callback = next.thread.bind(null, 'copy-packages', i);
			
			vendors[i].getFolders(null, false, callback);
			
			return;
		}
		
		next();
	})
	//copy packages
	.thread('copy-packages', function(i, error, folders, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		next.thread('copy-package', folders, i, 0);
	})
	//copy package
	.thread('copy-package', function(packages, i, j, next) {
		if(j < packages.length) {
			//append the admin folder
			packages[j].path += this.path('/admin');
			
			//is there an admin folder ?
			if(!packages[j].isFolder()) {
				//move on
				next.thread('copy-package', packages, i, j + 1);
				return;
			}
			
			//copy to deploy
			next.thread('copy-package-to-deploy', packages, i, j);
			return;
		}
		
		next.thread('copy-vendor', i + 1);
	})
	//copy package to deploy
	.thread('copy-package-to-deploy', function(packages, i, j, next) {
		// /[EVE_PATH]/package/[VENDOR]/[PACKAGE]/admin -> [DEPLOY_PATH]/application/package/[VENDOR]/[PACKAGE]
		var destination = this.getDeployPath() + '/application/package/' 
			+ vendors[i].getName() + '/' 
			+ packages[j].getParent().split(separator).pop(); 
		
		var callback = next.thread.bind(null, 'copy-package-to-build', packages, i, j);
		packages[j].copy(this.path(destination), callback);
	})
	//copy package to build
	.thread('copy-package-to-build', function(packages, i, j, error, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		// /[EVE_PATH]/package/[VENDOR]/[PACKAGE]/admin -> [BUILD_PATH]/package/[VENDOR]/[PACKAGE]/[NAME]
		var destination = this.getBuildPath() + '/package/' 
			+ vendors[i].getName() + '/' 
			+ packages[j].getParent().split(separator).pop() + '/'
			+ name; 
		
		var callback = next.thread.bind(null, 'next-package', packages, i, j);
		packages[j].copy(this.path(destination), callback);
	})
	//check for errors and traverse to the next package
	.thread('next-package', function(packages, i, j, error, next) {
		if(error) {
			this.trigger('error', error);
			return;
		}
		
		next.thread('copy-package', packages, i, j + 1);
	})
	//finish up
	.then(function(next) {
		this.trigger('install-complete', 'admin', name);	
		next();
	});
};