module.exports = function(settings, content, data) {
	var eden			= settings.eden,
		normalize 	= settings.normalize,
		defaults 		= [];
	
	//for each fields
	eden('hash').each(data.fields, function(name, field) {
		field = normalize(field);
		var variable = 'this.data.' + data.slug + '.' + name;
		
		if(field.default) {
			var value = field.default;
			
			if(value == 'now()') {
				value = '_convertToControlDate(Date.now())';
			}
			
			defaults.push(variable + ' = ' + value + ';');
		}
	});
	
	return eden('string').replace(content, /{CONTROL_DEFAULTS}/g	, defaults.join("\n		"));
};