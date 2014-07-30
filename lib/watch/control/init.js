module.exports = function(eden, eve, local, args, settings, watch) {
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