module.exports = function(eden, eve, local, args, settings, watch) {
	//if this is a file
	if(!settings.isFile()) {
		eve.trigger('error', 'No server deploy directory set.');
		eve.listen('install-server-complete', watch);
		require('./install-server')(eve, local, args);
		
		return;
	}
	
	//this is a file
	settings.getContent(function(error, content) {
		if(error) {
			eve.trigger('error', error);
			return;
		}
		
		var json = JSON.parse(content);	
		
		//if there is already a server path
		if(json.server && json.server.path) {
			watch();
			return;
		}
		
		//no server path set 
		eve.trigger('error', 'No server deploy directory set.');
		eve.listen('install-server-complete', watch);
		require('./install-server')(eve, local, args);
	});
};