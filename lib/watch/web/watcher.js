module.exports = function(eden, eve, local, settings) {
	settings.getContent(function(error, content) {
		if(error) {
			eve.trigger('error', error);
			return;
		}
		
		var config = JSON.parse(content);	
		
		var watcher = require('chokidar')
		.watch(local, { ignored: /[\/\\]\./, persistent: true, ignoreInitial: true })
		.on('all', function(event, path, stats) {
			//NOTE: event types - unlink, add, change, unlinkDir, addDir
			//path test
			var destination, 
				seperator = require('path').sep,
			 	pathArray = path.substr(local.length).split(seperator);
			
			//update if [CALLER]/package/[VENDOR]/[PACKAGE]/web/*
            if(pathArray[1] && pathArray[4] 
			&& pathArray[1] == 'package'
			&& pathArray[4] == 'web') {
				destination = config.web.path 
					+ seperator + 'application' + seperator + 'package' + seperator 
					+ pathArray[2] + seperator 
					+ pathArray[3] + seperator  
					+ pathArray.slice(5).join(seperator);
			//unlinkDir - [CALLER]/package/*
			} else if(event == 'unlinkDir' 
			&& pathArray[1] && pathArray[2] 
			&& pathArray[1] == 'package') {
				//TODO: Not working. async call not synced
				//we are removing a vendor folder
				//destination = config.eve.web 
				//	+ '/package/' 
				//	+ pathArray[2];
			//update if [CALLER]/config/web/*
			} else if(pathArray[1] && pathArray[2] 
			&& pathArray[1] == 'config'
			&& pathArray[2] == 'web') {
				destination = config.web.path
					+ seperator + 'application' + seperator + 'config' + seperator
					+ pathArray.slice(3).join(seperator);
			}
			
			//destination cannot be determined
			if(!destination) {
				eve.trigger('watch-web-404', event, eve, local, config);
				return;
			}
			
			//if destination starts with a .
			if(destination.indexOf('.') === 0) {
				//destination is relative to local
				destination = local + '/' + destination;
			}
			
			//we are updating now
			eve.trigger('watch-web-update', event, 
			path, destination, eve, local, config, 
			function(event, path, destination, callback) {
				switch(event) {
					case 'unlink':
						eden('file', destination).remove(callback);
						break;
					case 'add':
					case 'change':
						eden('file', path)
						.copy(destination, callback);
						break;
					case 'unlinkDir':
						eden('folder', destination).remove(callback);
						break;
					case 'addDir':
						eden('folder', destination).mkdir(callback);
						break;
				}
			});
		});
		
		//trigger init
		eve.trigger('watch-web-init', eve, local, config);
	});
};