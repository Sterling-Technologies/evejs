module.exports = function(settings, content, data) {
	var eden		= settings.eden,
		normalize 	= settings.normalize,
		convert 	= [];
		
	//for each fields
	eden('hash').each(data.fields, function(name, field) {
		field = normalize(field);
		
		var variable = 'this.data.' + data.slug + '.' + name;
		
		if(field.field[0] === 'datetime'
		|| field.field[0] === 'date'
		|| field.field[0] === 'time') {
			convert.push(variable + ' = ' + '_convertToServerDate(' + variable + ');');
			return;
		}
	});
	
	return eden('string').replace(content, /{CONTROL_SERVER_CONVERT}/g	, convert.join("\n			"));
};