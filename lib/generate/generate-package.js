var render = function(settings, content, data) {
	data.vendor = settings.vendor.name;
	
	//add slug field if wanted
	if(data.slug) {
		data.fields.slug = normalize({
			label	: 'Slug',
			type	: 'string',
			field	: false
		});
	}
	
	//add active field if wanted
	if(data.active) {
		data.fields.active = normalize({
			label	: 'Active',
			type	: 'boolean',
			default	: true,
			field	: false
		});
	}
	
	//add created field if wanted
	if(data.created) {
		data.fields.created = normalize({
			label	: 'Created',
			type	: 'date',
			default	: 'now()',
			field	: false
		});
	}
	
	//add updated field if wanted
	if(data.updated) {
		data.fields.updated = normalize({
			label	: 'Updated',
			type	: 'date',
			default	: 'now()',
			field	: false
		});
	}
	
	//render the body
	return Handlebars.compile(content)(data)
		.replace(/\\\{\s*/g, '{')
		.replace(/\\\}/g, '}');
};

var normalize = function(field) {
	var normal = { type: field.type || 'string' };
	
	normal.field 	= field.field 	|| ['text'];
	normal.valid 	= field.valid 	|| [];
	normal.label 	= field.label 	|| '';
	normal.holder 	= field.holder 	|| '';
	normal.search 	= field.search 	|| false;
	
	if(field.field === false) {
		normal.field = false;
	} else if(typeof normal.field === 'string') {
		normal.field = [normal.field];
	}
	
	if(typeof normal.valid === 'string') {
		normal.valid = [[normal.valid]];
	}
	
	if(typeof field.default !== 'undefined') {
		normal.default = field.default;
	}
	
	var valid = [];
	
	for(var i = 0; i < normal.valid.length; i++) {
		if(normal.valid[i] instanceof Array) {
			valid.push(normal.valid[i]);
			continue;
		}
		
		valid.push([normal.valid[i]]);
	}
	
	normal.valid = valid;
	
	if(field.options instanceof Array) {
		normal.options = [];
		for(i = 0; i < field.options.length; i++) {
			if(typeof field.options[i] === 'string') {
				normal.options.push({
					value: field.options[i],
					label: field.options[i][0].toUpperCase() + field.options[i].substr(1)
				});
				
				continue;
			}
			
			normal.options.push(field.options[i]);
		}
		
		valid.push(['one', normal.options]);
	}
	
	return normal;
};

var Handlebars 	= require('handlebars');

Handlebars.registerHelper('when', function (value1, operator, value2, options) {
	var valid = false;
	
	switch (true) {
		case operator == 'eq' 	&& value1 == value2:
		case operator == '==' 	&& value1 == value2:
		case operator == 'req' 	&& value1 === value2:
		case operator == '===' 	&& value1 === value2:
		case operator == 'neq' 	&& value1 != value2:	
		case operator == '!=' 	&& value1 != value2:
		case operator == 'rneq' && value1 !== value2:
		case operator == '!==' 	&& value1 !== value2:
		case operator == 'lt' 	&& value1 < value2:
		case operator == '<' 	&& value1 < value2:
		case operator == 'lte' 	&& value1 <= value2:
		case operator == '<=' 	&& value1 <= value2:
		case operator == 'gt' 	&& value1 > value2:
		case operator == '>' 	&& value1 > value2:
		case operator == 'gte' 	&& value1 >= value2:
		case operator == '>=' 	&& value1 >= value2:
		case operator == 'and' 	&& value1 && value2:
		case operator == '&&' 	&& (value1 && value2):
		case operator == 'or' 	&& value1 || value2:
		case operator == '||' 	&& (value1 || value2):
		
		case operator == 'startsWith' 
		&& value1.indexOf(value2) === 0:
		
		case operator == 'endsWith' 
		&& value1.indexOf(value2) === (value1.length - value2.length):
			valid = true;
			break;
	}
	
	if(valid) {
		return options.fn(this);
	}
	
	return options.inverse(this);
});

Handlebars.registerHelper('loop', function(object, options) {
	var i = 0, buffer = '', key, total = Object.keys(object).length;

	for (key in object) {
		if (object.hasOwnProperty(key)) {
			buffer += options.fn({key: key, value: object[key], last: ++i === total});
		}
	}
 
	return buffer;
});
	
Handlebars.registerHelper('in', function(value, list, options) {
	list = list.split(',');
	for (var i = 0; i < list.length; i++) {
		if(list[i] === value) {
			return options.fn(this);
		}
	}
 
	return '';
});

Handlebars.registerHelper('notin', function(value, list, options) {
	list = list.split(',');
	for (var i = 0; i < list.length; i++) {
		if(list[i] === value) {
			return '';
		}
	}
 
	return options.fn(this);
});

Handlebars.registerHelper('schema', function() {
	var i, name, field, meta, more, schema = {};
	
	for(name in this.fields) {
		if(this.fields.hasOwnProperty(name)) {
			field 	= this.fields[name];
			meta 	= { type: field.type };
			more 	= false;
			
			if(field.options) {
				meta.enum = [];
				for(i = 0 ; i < field.options.length; i++) {
					meta.enum.push(field.options[i].value);
				}
				
				more = true;
			}
			
			if(typeof field.default !== 'undefined') {
				meta.default = field.default;
				more = true;
				
				//if default is a native object
				if(meta.default === 'now()') {
					meta.default = '{NOW}';
				}
			}
			
			for(i = 0; i < field.valid.length; i ++) {
				if(field.valid[i][0] === 'required') {
					meta.required = true;
					more = true;
					break;
				}
			}
			
			schema[name] = meta;
			
			schema[name].type = '{' + schema[name].type.toUpperCase() + '}';
			
			if(!more) {
				schema[name] = schema[name].type;
			}
		}
	}
	
	//add revision field if wanted
	if(this.use_revision) {
		var revision = {};
		for(name in schema) {
			if(schema.hasOwnProperty(name)) {
				revision[name] = schema[name];
			}
		}
		
		schema.revision = [revision];
	}
	
	schema = JSON.stringify([schema], null, 4);
	
	schema = schema.substr(6, schema.length - 8);
	
	return schema
		.replace(/"{STRING}"/g	, 'String')
		.replace(/"{DATE}"/g	, 'Date')
		.replace(/"{NUMBER}"/g	, 'Number')
		.replace(/"{BOOLEAN}"/g	, 'Boolean')
		.replace(/"{BUFFER}"/g	, 'Buffer')
		.replace(/"{NOW}"/g		, 'Date.now');
});
	
Handlebars.registerHelper('searchable', function() {
	var name, field, term, searchable = [];
	for(name in this.fields) {
		if(this.fields.hasOwnProperty(name)) {
			field 	= this.fields[name];
			
			if(!field.search) {
				continue;
			}
			
			term = {};
			term[name] = '{VALUE}';
			searchable.push(term);
		}
	}
	
	if(!searchable.length) {
		return '';
	}
	
	searchable = JSON.stringify([[[searchable]]], null, 4);

	searchable = searchable.replace(/"{VALUE}"/g, 'new RegExp(keyword, \'ig\')');
	
	searchable = searchable.substr(30, searchable.length - 48);
	
	return 'or.push(' + searchable + ');';
});

module.exports = function(settings, config, source, destination, deploy, done) {
	var eden 		= settings.eden, 
		eve 		= settings.eve;
	
	var variables = {};
	
	destination = destination.replace('SLUG', config.name);
	deploy 		= deploy.replace('SLUG', config.name);
	
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