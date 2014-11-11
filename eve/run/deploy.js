module.exports = function(eve, command) {
	var settings		= eve.getSettings(),
		build			= eve.getBuildPath(),
		config			= build + '/config',
		packages		= build + '/package';
	
	//clear cache
	eve.Folder('/').clear();
	
	eve
	
	.sync(function(next) {
		var environments = Object.keys(settings.environments);
		
		next.thread('remove-environments-loop', 0, environments);
	})
	
	.thread('remove-environments-loop', function(i, environments, next) {
		if(i < environments.length) {
			var environment = settings.environments[environments[i]].path;
			
			var deploy = this.setDeployPath(environment).getDeployPath();
			
			var extra = '';
			
			if(settings.environments[environments[i]].type !== 'server') {
				extra = '/application';
			}
			
			
			
			this.Folder(deploy + extra + '/config').remove(function(error) {
				if(error) {
					//this.trigger('error', error);
					//return;
				}
				
				this.Folder(deploy + extra + '/package').remove(function(error) {
					if(error) {
						//this.trigger('error', error);
						//return;
					}
					
					next.thread('remove-environments-loop', i + 1, environments);
				}.bind(this));
			}.bind(this));
			
			return;
		}
		
		next();
	})
	
	.then(function(next) {
		if(!this.Folder(config).isFolder()) {
			next();
			return;
		}
		
		this.Folder(config).getFolders(function(error, folders) {
			if(error) {
				this.trigger('error', error);
				return;
			}
			
			next.thread('config-loop', 0, folders);
		}.bind(this));
	})
	
	.thread('config-loop', function(i, folders, next) {
		if(i < folders.length) {
			var environment = folders[i].getName();
			var deploy = settings.environments[environment].path;
			
			deploy = this.setDeployPath(deploy).getDeployPath();
			
			var extra = '';
			if(settings.environments[environment].type !== 'server') {
				extra = '/application';
			}
			
			var destination = deploy + extra + '/config';
			
			folders[i].copy(destination, function(error) {
				if(error) {
					this.trigger('error', error);
					return;
				}
				
				next.thread('config-loop', i + 1, folders);
			}.bind(this));
			
			return;
		}
		
		next();
	})
	
	.then(function(next) {
		if(!this.Folder(packages).isFolder()) {
			next();
			return;
		}
		
		this.Folder(packages).getFolders(function(error, folders) {
			if(error) {
				this.trigger('error', error);
				return;
			}
			
			next.thread('package-loop', 0, folders);
		}.bind(this));
	})
	
	.thread('package-loop', function(i, folders, next) {
		if(i < folders.length) {
			var package = folders[i].getName();
			
			folders[i].getFolders(function(error, environments) {
				if(error) {
					this.trigger('error', error);
					return;
				}
				
				next.thread('environment-loop', i, 0, package, folders, environments);
			}.bind(this));
			
			return;
		}
		
		next();
	})
	
	.thread('environment-loop', function(i, j, package, folders, environments, next) {
		if(j < environments.length) {
			var environment = environments[j].getName();
			var deploy = settings.environments[environment].path;
			
			deploy = this.setDeployPath(deploy).getDeployPath();
			
			var extra = '';
			if(settings.environments[environment].type !== 'server') {
				extra = '/application';
			}
			
			var destination = deploy + extra + '/package/' + package;
			
			environments[j].copy(destination, function(error) {
				if(error) {
					this.trigger('error', error);
					return;
				}
				
				next.thread('environment-loop', i, j + 1, package, folders, environments);
			}.bind(this));
			
			return;
		}
		
		next.thread('package-loop', i + 1, folders);
	})
	
	.then(function(next) {
		this.trigger('deploy-complete');
	});
};