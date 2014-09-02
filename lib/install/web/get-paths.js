module.exports = function(eden, eve, local, deploy, next) {
	var settings = eden('file', local + '/build.json');

	var setPath = function(settings, next, json) {
		json = json || {};
		json.web = json.web || {};

		json.web.lint = json.web.lint || {
			globals : {
				define 		: true,
				controller 	: true,
				console 	: true,
				require 	: true,
				Handlebars 	: true
			},

			bitwise 		: false,
			strict 			: false,
			browser 		: true,
			jquery 			: true,
			node 			: false,
			maxcomplexity	: 20
		};

		deploy.path = (local +'/deploy/web').replace(/\//g, require('path').sep);
		json.web.path = ('./deploy/web').replace(/\//g, require('path').sep);

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

			//if there is already a web path
			if(json.web && json.web.path) {
				deploy.path = json.web.path;
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