module.exports = function(eve, command) {
	var environments = command[0] || 'all',
		settings = eve.getSettings();
	
	if(environments === 'all') {
		environments = Object.keys(settings.environments);
	} else {
		environments = [environments];
	}
	
	//clear cache
	eve.Folder('/').clear();
	
	eve
	//make map files
	.sync(function(next) {
		next.thread('make-map', 0);
	})
	.thread('make-map', function(i, next) {
		if(i < environments.length) {
			if(settings.environments[environments[i]].type === 'server') {
				next.thread('make-map', i + 1);
				return;
			}
			
			//get the deploy path
			var deploy = this
				.setDeployPath(settings.environments[environments[i]].path)
				.getDeployPath();
			
			var extra = '/application';
			
			if(settings.environments[environments[i]].type === 'phonegap') {
				extra = '/www/application';
			}
			
			//get all the files in the deploy path
			this.Folder(deploy + extra)
			.getFiles(null, true, function(error, files) {
				//if there's an error
				if(error) {
					this.trigger('error', error);
					//do nothing
					return;
				}
				
				//add files to the map
				for(var map = [], j = 0; j < files.length; j++) {
					map.push(files[j].path.substr(deploy.length));
				}
				
				//set the map
				this.File(deploy + extra + '/map.js')
				.setContent('jQuery.eve.map = '+JSON.stringify(map)+';', 
				function(error) {
					if(error) {
						this.trigger('error', error);
						return;
					}
					
					next.thread('make-map', i + 1);
				}.bind(this));
			}.bind(this));
			
			return;
		}
		
		next();
	})
	
	.then(function() {
		this.trigger('map-complete');
	});
};