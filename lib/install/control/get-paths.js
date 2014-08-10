module.exports = function(eden, wizard, local, deploy, next) {
	var settings = eden('file', local + '/build.json');
		
	var setPath = function(settings, next, json) {
		json = json || {};
		json.control = json.control || {};
		json.control.lint = json.control.lint || {
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
		
		var copy = [{
			name 		: 'control',
			description : 'Where should eve deploy control to ? (default: ' + local +'/deploy/control)',
			type 		: 'string' }];
		
		wizard.get(copy, function(error, result) {
			if(error) {
				eve.trigger('error', error);
				return;
			}
			
			deploy.path = json.control.path = result.control || local +'/deploy/control';
			  
			//write this to settings
			settings.setContent(JSON.stringify(json, null, 4), function(error) {
				if(error) {
					eve.trigger('error', error);
				}	
				
				next();
			});
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
			
			//if there is already a control path
			if(json.control && json.control.path) {
				deploy.path = json.control.path;
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