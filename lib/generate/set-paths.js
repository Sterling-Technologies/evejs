module.exports = function(eve, settings, error, content, next) {
	if(error) {
		eve.trigger('error', error);
		return;
	}

	// parse content
	content = JSON.parse(content.toString());

	// set server settings
	settings.server 	= content.server;
	// set control settings
	settings.control 	= content.control;
	// set web settings
	settings.web 		= content.web;	

	next();
};