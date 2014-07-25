module.exports = function(eve, local, args) {
	var eden = require('edenjs');
	
	var settings = eden('file', local + '/build.json');
	
	var watch = function() {
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
				var destination, pathArray = path.substr(local.length).split('/');
				
				//update if [CALLER]/package/[VENDOR]/[PACKAGE]/control/test/*
				if (pathArray[1] && pathArray[4] 
				&& pathArray[1] == 'package'
				&& pathArray[4] == 'control'
				&& pathArray[5] === 'test') {
					destination = config.control.path
						+ '/test/'
                                                + pathArray[2] + '/'
						+ pathArray[3] + '/'
						+ pathArray.slice(6).join('/');
                                } else if (event == 'unlinkDir'
				&& pathArray[1] && pathArray[4] 
				&& pathArray[1] == 'package'
				&& pathArray[4] == 'control'
				&& pathArray[5] === 'test'
				&& pathArray[6] === '') {
					destination = config.control.path
						+ '/test/'
                                                + pathArray[2];

				//update if [CALLER]/package/[VENDOR]/[PACKAGE]/control/*
                                } else if(pathArray[1] && pathArray[4] 
				&& pathArray[1] == 'package'
				&& pathArray[4] == 'control') {
					destination = config.control.path 
						+ '/application/package/' 
						+ pathArray[2] + '/' 
						+ pathArray[3] + '/'  
						+ pathArray.slice(5).join('/');
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
						+ '/application/config/'
						+ pathArray.slice(3).join('/');
				}
				
				//destination cannot be determined
				if(!destination) {
					eve.trigger('watch-control-404', event, eve, local, config);
					return;
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
	
	//if this is a file
	if(!settings.isFile()) {
		eve.trigger('error', 'No control deploy directory set.');
		eve.listen('install-control-complete', watch);
		require('./install-control')(eve, local, args);
		return;
	}
	
	//this is a file
	settings.getContent(function(error, content) {
		if(error) {
			eve.trigger('error', error);
			return;
		}
		
		var json = JSON.parse(content);	
		
		//if there is already a control path
		if(json.control && json.control.path) {
			watch();
			return;
		}
		
		//no control path set 
		eve.trigger('error', 'No control deploy directory set.');
		eve.listen('install-control-complete', watch);
		require('./install-control')(eve, local, args);
	});
};