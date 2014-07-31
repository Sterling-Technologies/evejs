module.exports = function(settings, next) {
	var eden 		= settings.eden,
		eve 		= settings.eve,
		paths 		= settings.paths,
		parameter 	= settings.parameter;
	
	//is there a parameter?
	if(!parameter || !parameter.length) {
		eve.trigger('error', 'Invalid parameter. Must be in the form of vendor or vendor/package');
		return;
	}
	//is the schema valid?
	if(parameter.split('/').length > 2) {
		eve.trigger('error', 'Invalid parameter. Must be in the form of vendor or vendor/package');
		return;
	}

	//is there a slash?
	if(parameter.split('/').length == 2 && !eden('file', paths.schema + parameter + '.js').isFile()) {
		eve.trigger('error', paths.schema + parameter + '.js does not exist.');
		return;
	}

	next(settings);
};