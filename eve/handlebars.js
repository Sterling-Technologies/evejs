
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
			
			if(field.type === 'file') {
				schema[name] = [];
				continue;
			}
			
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
		.replace(/"{NOW}"/g		, 'Date.now')
		.replace(/"{ARRAY}"/g   , 'Array')
		.replace(/"{OBJECT}"/g  , 'Object');
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

module.exports = Handlebars;