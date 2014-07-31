module.exports = function(settings, content, data) {
	var eden			= settings.eden,
		copy			= settings.copy,
		normalize 	= settings.normalize,
		fields 			= [];
	
	eden('hash').each(data.fields, function(name, field) {
		field = normalize(field);
		
		if(field.field === false || !copy.field[field.field[0]]) {
			return;
		}
		
		var holder 	= field.holder || '';
		var pattern = field.field[1] || '';
		
		if(holder.length) {
			holder = ' \'placeholder="' + holder + '"\'';
		}
		
		var html = copy.field[field.field[0]]
			.replace(/{SLUG}/g 			, name)
			.replace(/{PACKAGE}/g 		, data.slug)
			.replace(/{PLACEHOLDER}/g 	, holder)
			.replace(/{PATTERN}/g		, pattern)
			.replace(/{LIST}/g			, '../'+name+'List');

		if(field.options && field.field[0] !== 'select') {
			var items = [];
			eden('array').each(field.options, function(i, item) {
				items.push(html.replace('{CHOICE}', item.value).replace('{LABEL}', item.label));
			});
			
			html = html.join("\n");
		} else {
			html = html.replace('{CHOICE}', 1).replace('{LABEL}', 'Yes');
		}
		
		html = copy.field.fieldset
			.replace('{LABEL}', field.label)
			.replace('{SLUG}', name)
			.replace('{FIELD}', "\n                    	"+html+"\n                    ");
			
		fields.push(html);
	});
	
	return eden('string').replace(content, /{CONTROL_FIELDSET}/g	, fields.join("\n\n		    		"));
};