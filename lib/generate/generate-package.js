module.exports = function(settings, config, source, destination, deploy, done) {
	var eden 	= settings.eden, 
		eve 	= settings.eve;
	
	destination = destination.replace('SLUG', config.slug);
	deploy 		= deploy.replace('SLUG', config.slug);
	
	//if this is not an html css, or js file
	if(source.getExtension() !== 'js' 
	&& source.getExtension() !== 'html'
	&& source.getExtension() !== 'json') {
		//just pass it along
		source.copy(destination, function() {
			//also deploy it
			source.copy(deploy, function() {
				done();
			});
		});
		
		return;
	}
	
	//get the content
	source.getContent(function(error, content) {
		if(error) {
			eve.trigger('error', error);
			return;
		}
		
		content = render(settings, content.toString(), config);
		
		//send back
		eden('file', destination).setContent(content, function(error) {
			if(error) {
				eve.trigger('error', error);
				return;
			}
			
			//also deploy it
			eden('file', deploy).setContent(content, function(error) {
				if(error) {
					eve.trigger('error', error);
					return;
				}
				
				done();
			});
		});
	});
};

var render = function(settings, content, data) {
	//add slug field if wanted
	if(data.use_slug) {
		data.fields.slug = {
			label	: 'Slug',
			type	: 'string',
			field	: false
		};
	}
	
	//add active field if wanted
	if(data.use_active) {
		data.fields.active = {
			label	: 'Active',
			type	: 'boolean',
			default	: true,
			field	: false
		};
	}
	
	//add created field if wanted
	if(data.use_created) {
		data.fields.created = {
			label	: 'Created',
			type	: 'date',
			default	: 'now()',
			field	: false
		};
	}
	
	//add updated field if wanted
	if(data.use_updated) {
		data.fields.updated = {
			label	: 'Updated',
			type	: 'date',
			default	: 'now()',
			field	: false
		};
	}
	
	if(content.indexOf('{SERVER_SCHEMA}') !== -1) {
		content = require('./render/server-schema')(settings, content, data);
	}
	
	if(content.indexOf('{SERVER_SEARCHABLE}') !== -1) {
		content = require('./render/server-searchable')(settings, content, data);
	}
	
	if(content.indexOf('{SERVER_VALIDATION}') !== -1) {
		content = require('./render/server-validation')(settings, content, data);
	}
	
	if(content.indexOf('{CONTROL_FIELDSET}') !== -1) {
		content = require('./render/control-fieldset')(settings, content, data);
	}
	
	if(content.indexOf('{CONTROL_HEADERS}') !== -1) {
		content = require('./render/control-headers')(settings, content, data);
	}
	
	if(content.indexOf('{CONTROL_COLUMNS}') !== -1) {
		content = require('./render/control-columns')(settings, content, data);
	}
	
	if(content.indexOf('{CONTROL_ENUMS}') !== -1) {
		content = require('./render/control-enums')(settings, content, data);
	}
	
	if(content.indexOf('{CONTROL_DEFAULTS}') !== -1) {
		content = require('./render/control-defaults')(settings, content, data);
	}
	
	if(content.indexOf('{CONTROL_SERVER_CONVERT}') !== -1) {
		content = require('./render/control-server-convert')(settings, content, data);
	}
	
	if(content.indexOf('{CONTROL_APP_CONVERT}') !== -1) {
		content = require('./render/control-app-convert')(settings, content, data);
	}
	
	if(content.indexOf('{CONTROL_VALIDATION}') !== -1) {
		content = require('./render/control-validation')(settings, content, data);
	}
	
	if(content.indexOf('{CONTROL_OUTPUT_FORMAT}') !== -1) {
		content = require('./render/control-output-format')(settings, content, data);
	}
	
	if(content.indexOf('{WEB_SERVER_CONVERT}') !== -1) {
		content = require('./render/web-server-convert')(settings, content, data);
	}
	
	if(content.indexOf('{WEB_VALIDATION}') !== -1) {
		content = require('./render/web-validation')(settings, content, data);
	}
	
	if(content.indexOf('{USE_SLUG') !== -1) {
		content = require('./render/use-slug')(settings, content, data);
	}
	
	if(content.indexOf('{USE_ACTIVE') !== -1) {
		content = require('./render/use-active')(settings, content, data);
	}
	
	if(content.indexOf('{USE_CREATED') !== -1) {
		content = require('./render/use-created')(settings, content, data);
	}
	
	if(content.indexOf('{USE_UPDATED') !== -1) {
		content = require('./render/use-updated')(settings, content, data);
	}
	
	//Change variables
	content = settings.eden('string').replace(content, /{SLUG}/g		, data.slug);
	content = settings.eden('string').replace(content, /{ICON}/g		, data.icon);
	content = settings.eden('string').replace(content, /{SINGULAR}/g	, data.singular);
	content = settings.eden('string').replace(content, /{PLURAL}/g		, data.plural);
	content = settings.eden('string').replace(content, /{VENDOR}/g		, settings.vendor.name);
	
	return content;
};