module.exports = function(settings, content, data) {
	var eden			= settings.eden,
		normalize 	= settings.normalize;
		
	var headers = [];
	//for each fields
	eden('hash').each(data.fields, function(name, field) {
		if(field.field instanceof Array 
		&& (field.field[0] == 'textarea'
		|| field.field[0] == 'wysiwyg'
		|| field.field[0] == 'markdown')) {
			return;
		}
		
		headers.push('<th>'+normalize(field).label+'</th>');
	});
	
	return eden('string').replace(content, /{CONTROL_HEADERS}/g	, headers.join("\n                        "));
};