module.exports = function(eve, command) {
	var environments 	= command.shift() || 'all',
		settings 		= eve.getSettings(),
		build			= eve.getBuildPath(),
		separator		= require('path').sep;
	
	if(environments === 'all') {
		environments = Object.keys(settings);
	}
	
	//make environments into an array
	if(typeof environments === 'string') {
		environments = environments.split(',');
	}
	
	require('chokidar')
	.watch(build, { ignored: /[\/\\]\./, persistent: true, ignoreInitial: true })
	.on('all', function(event, source, stats) {
		//NOTE: event types - unlink, add, change, unlinkDir, addDir
		//path test
		var destination, 
			path = source.substr(build.length).split(separator);
		
		for(var extra, i = 0; i < environments.length; i++) {
			extra = '';
			if(settings[environments[i]].type !== 'server') {
				extra = separator + 'application'
			}
			
			if(path.length > 3
			&& path[1] == 'package'
			&& path[3] == environments[i]) {
				destination = settings[environments[i]].path
					+ extra 	+ separator 
					+ 'package' + separator
					+ path[2] 	+ separator  
					+ path.slice(4).join(separator);
				
				break;
			}  
			
			if(path.length > 2
			&& path[1] == 'config'
			&& path[2] == environments[i]) {
				destination = settings[environments[i]].path
					+ extra 	+ separator 
					+ 'config' 	+ separator
					+ path.slice(3).join(separator);
				
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
		
		//we are updating now
		eve.trigger('watch-update', 
		event, settings[environments[i]].type, 
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
	
	eve.trigger('watch-init', environments);
};