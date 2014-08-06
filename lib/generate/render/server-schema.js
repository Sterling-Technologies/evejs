module.exports = function(settings, content, data) {
	var eden			= settings.eden,
		normalize 	= settings.normalize;
		
	//determine the schema
	var schema = {};
	
	eden('hash').each(data.fields, function(name, field) {
		field = normalize(field);
		var meta = { type: field.type };
		var more = false;
		
		if(field.options) {
			meta.enum = [];
			for(var i = 0 ; i < field.options.length; i++) {
				meta.enum.push(field.options[i].value);
			}
			
			more = true;
		}
		
		if(typeof field.default != 'undefined') {
			meta.default = field.default;
			more = true;
			
			//if default is a native object
			if(meta.default === 'now()') {
				meta.default = '{NOW}';
			}
		}
		
		for(var i = 0; i < field.valid.length; i ++) {
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
	});
	
	//add revision field if wanted
	if(data.use_revision) {
		schema.revision = [Object.create(schema)];
	}
	
	schema = JSON.stringify([schema], null, 4);
	
	schema = schema.substr(6, schema.length - 8);
	
	schema = eden('string').replace(schema, /"{STRING}"/g	, 'String');
	schema = eden('string').replace(schema, /"{DATE}"/g		, 'Date');
	schema = eden('string').replace(schema, /"{NUMBER}"/g	, 'Number');
	schema = eden('string').replace(schema, /"{BOOLEAN}"/g	, 'Boolean');
	schema = eden('string').replace(schema, /"{BUFFER}"/g	, 'Buffer');
	schema = eden('string').replace(schema, /"{NOW}"/g		, 'Date.now');
	
	schema = 'prototype.schema = ' + schema + ';';
	
	return eden('string').replace(content, /{SERVER_SCHEMA}/g	, schema);
};