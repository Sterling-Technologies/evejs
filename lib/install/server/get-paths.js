module.exports = function(eden, eve, local, deploy, next) {
	var settings = eden('file', local + '/build.json');

	var setPath = function(settings, next, json) {
		json = json || {};
		json.server = json.server || {};
		json.server.lint = json.server.lint || {
			bitwise 		: false,
			strict 			: false,
			node 			: true,
			maxcomplexity	: 20
		};

		deploy.path = (local +'/deploy/server').replace(/\//g, require('path').sep);
		json.server.path = ('./deploy/server').replace(/\//g, require('path').sep);

		//write this to settings
		settings.setContent(JSON.stringify(json, null, 4), function(error) {
			if(error) {
				eve.trigger('error', error);
			}	

			next();
		});
	};

	//if this is a file
	if(settings.isFile()) {
		settings.getContent(function(error, content) {
			if(error) {
				eve.trigger('error', error);
				return;
			}

			var json = JSON.parse(content);	

			//if there is already a server path
			if(json.server && json.server.path) {
				deploy.path = json.server.path;
				//goto next
				next();
				return;
			}

			//at this point there is no settings
			//we need to prompt for the path
			setPath(settings, next, json);
		});

		return;
	}

	//this is not a file
	//we need to prompt for the path
	setPath(settings, next);
};