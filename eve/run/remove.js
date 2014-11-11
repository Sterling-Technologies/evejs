module.exports = function(eve, command) {
	var wizard 		= require('prompt'),
		name 		= command[0],
		settings	= eve.getSettings(),
		build		= eve.getBuildPath(),
		package		= build + '/package/' + name;
	 
	if(!name) {
		this.trigger('error', 'No package specified.');
		return;
	} 
	
	if(!eve.Folder(package).isFolder()) {
		this.trigger('error', 'This is not a valid package.');
		return;
	}
	
	//clear cache
	eve.Folder('/').clear();
	
	eve
	
	.sync(function(next) {
		this.Folder(package).getFolders(function(error, folders) {
			if(!folders.length) {
				this.trigger('error', 'This is not a valid package.');
				return;
			}
			
			var copy = [{
				name 		: 'allow',
				description : 'All contents in ' + name + ' will be removed .. '
							+ 'Do you want to continue ? (Default: No)',
				type 		: 'string' 
			}];
			
			wizard.get(copy, function(error, result) {
				if(error) {
					this.trigger('error', error);
					return;
				}
				
				if(['', 'y', 'yes'].indexOf(result.allow.toLowerCase()) === -1) {
					this.trigger('error', 'Process has been aborted!');
					return;
				}
				
				next();
			}.bind(this));
		}.bind(this));
	})
	
	.then(function(next) {
		//what environments?
		this.Folder(package).getFolders(function(error, folders) {
			if(error) {
				this.trigger('error', error);
				return;
			}
			
			next.thread('environment-loop', 0, folders);
		}.bind(this));
	})
	
	.thread('environment-loop', function(i, environments, next) {
		if(i < environments.length) {
			next.thread('remove-config', i, environments);
			return;
		}
		
		next();
	})
	
	.thread('remove-config', function(i, environments, next) {
		var file = build + '/config/' + environments[i] + '/packages.json';
		
		file = this.File(file);
		
		if(!file.isFile()) {
			next.thread('remove-package', i, environments);
			return;
		}
		
		file.getData(function(error, data) {
			if(error) {
				this.trigger('error', error);
				return;
			}
			
			var changed = [];
			for(var j = 0; j < data.length; j++) {
				if(data[j] === name) {
					continue;
				}
				
				changed.push(data[j]);
			}
			
			file.setData(changed, function(error) {
				if(error) {
					this.trigger('error', error);
					return;
				}
				
				next.thread('remove-package', i, environments);
			}.bind(this));
		}.bind(this));
	})
	
	.thread('remove-package', function(i, environments, next) {
		this.Folder(package).remove(function(error) {
			if(error) {
				//this.trigger('error', error);
				//return;
			}
			
			next.thread('environment-loop', i + 1, environments);
		}.bind(this));
	})
	
	.then(function(next) {
		this.trigger('remove-complete', name);
	});
};