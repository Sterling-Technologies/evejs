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

			//update if [CALLER]/package/[VENDOR]/[PACKAGE]/control/*
            if(pathArray[1] && pathArray[4] 
			&& pathArray[1] == 'package'
			&& pathArray[4] == 'control') {
					+ separator + 'application' + separator + 'package' + separator 
					+ pathArray[2] + separator 
					+ pathArray[3] + separator 
					+ pathArray.slice(5).join(separator);
			//unlinkDir - [CALLER]/package/*
			} else if(event == 'unlinkDir' 
			&& pathArray[1] && pathArray[2] 
			&& pathArray[1] == 'package') {
				//TODO: Not working. async call not synced
				//we are removing a vendor folder
				//destination = config.eve.control 
				//	+ '/package/' 
				//	+ pathArray[2];
			//update if [CALLER]/config/control/*
			} else if(pathArray[1] && pathArray[2] 
			&& pathArray[1] == 'config'
			&& pathArray[2] == 'control') {
				destination = config.control.path
					+ separator + 'application' + separator + 'config' + separator
					+ pathArray.slice(3).join(separator);
			}
			
			//destination cannot be determined
			if(!destination) {
				eve.trigger('watch-control-404', event, eve, local, config);
				return;
			}
			
			//if destination starts with a .
			if(destination.indexOf('.') === 0) {
				//destination is relative to local
				destination = local + '/' + destination;
			}
			
			//we are updating now
			eve.trigger('watch-control-update', event, 
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
		eve.trigger('watch-control-init', eve, local, config);
	});
};