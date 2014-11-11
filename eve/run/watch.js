module.exports = function(eve, command) {
	var separator 		= require('path').sep,
		environments 	= command.shift() || 'all',
		settings 		= eve.getSettings(),
		build			= eve.getBuildPath();
	
	//clear cache
	eve.Folder('/').clear();
	
	if(environments === 'all') {
		environments = Object.keys(settings.environments);
	}
	
	//make environments into an array
	if(typeof environments === 'string') {
		environments = environments.split(',');
	}
	
	var watcher = require('chokidar').watch(build, { 
		ignored: /[\/\\]\./, 
		persistent: true, 
		ignoreInitial: true 
	});
	
	watcher.on('all', function(event, source, stats) {
		//NOTE: event types - unlink, add, change, unlinkDir, addDir
		//path test
		var destination, path = source.substr(build.length).split(separator);
		
		for(var extra, i = 0; i < environments.length; i++) {
			extra = '';
			if(settings.environments[environments[i]].type !== 'server') {
				extra = '/application';
			}
			
			if(path.length > 3
			&& path[1] == 'package'
			&& path[3] == environments[i]) {
				destination = settings.environments[environments[i]].path
					+ extra 	+ '/package/'
					+ path[2] 	+ '/'  
					+ path.slice(4).join('/');
				
				break;
			}  
			
			if(path.length > 2
			&& path[1] == 'config'
			&& path[2] == environments[i]) {
				destination = settings.environments[environments[i]].path
					+ extra + '/config/'
					+ path.slice(3).join('/');
				
				break;
			}
		}
		
		//destination cannot be determined
		if(!destination) {
			eve.trigger('watch-404', event, source);
			return;
		}
		
		//if destination starts with a .
		if(destination.indexOf('.') === 0) {
			//destination is relative to local
			destination = build + destination.substr(1);
		}
		
		destination = eve.path(destination);
		
		//we are updating now
		eve.trigger('watch-update', 
		event, settings.environments[environments[i]].type, 
		environments[i], source, destination, 
		function(event, source, destination, callback) {
			switch(event) {
				case 'unlink':
					eve.File(destination).remove(callback);
					break;
				case 'add':
				case 'change':
					eve.File(source).copy(destination, callback);
					break;
				case 'unlinkDir':
					eve.Folder(destination).remove(callback);
					break;
				case 'addDir':
					eve.Folder(destination).mkdir(null, callback);
					break;
			}
		});
	});
	
	eve.trigger('watch-init', watcher, environments);
};