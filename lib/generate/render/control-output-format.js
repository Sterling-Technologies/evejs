module.exports = function(settings, content, data) {
	var eden 			= settings.eden, 
		normalize 	= settings.normalize,
		output 			= [];
	
	eden('hash').each(data.fields, function(name, field) {
		field = normalize(field);
		
		var variable = 'response.batch[0].results[i].' + name;
		
		switch(field.type) {
			case 'date':
				output.push(variable + ' = $.timeToDate((new Date('+variable+')).getTime());');
				break;
			case 'boolean':
				output.push(variable + ' = ' + variable+' ? \'Yes\': \'No\'');
				break;
		}
	});
	
	return eden('string').replace(content, /{CONTROL_OUTPUT_FORMAT}/g	, output.join("\n		   		"));
};