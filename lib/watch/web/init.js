module.exports = function(eden, eve, local, args, settings, watch) {
	//if this is a file
	if(!settings.isFile()) {
		eve.trigger('error', 'No web deploy directory set.');
		eve.listen('install-web-complete', watch);
		require('./install-web')(eve, local, args);
		return;
	}
	
	//this is a file
	settings.getContent(function(error, content) {
		if(error) {
			eve.trigger('error', error);
			return;
		}
		
		var json = JSON.parse(content);	
		
		//if there is already a web path
		if(json.web && json.web.path) {
			watch();
			return;
		}
		
		//no web path set 
		eve.trigger('error', 'No web deploy directory set.');
		eve.listen('install-web-complete', watch);
		require('./install-web')(eve, local, args);
	});
};