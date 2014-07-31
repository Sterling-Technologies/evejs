module.exports = function(settings, next) {
	var eden 	= settings.eden, 
		eve		= settings.eve, 
		local	= settings.local,
		config	= settings.config;
	
	eden('file', local + '/build.json')
	.getContent(function(error, content) {
		if(error) {
			eve.trigger('error', error);
			return;
		}
	
		// parse content
		content = JSON.parse(content.toString());
	
		// set server settings
		config.server 	= content.server;
		// set control settings
		config.control 	= content.control;
		// set web settings
		config.web 		= content.web;	
	
		next(settings);
	});
};