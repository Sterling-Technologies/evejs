module.exports = function(settings, content, data) {
	var eden			= settings.eden,
		normalize 	= settings.normalize,
		convert 		= [];
		
	//for each fields
	eden('hash').each(data.fields, function(name, field) {
		field = normalize(field);
		
		var variable = 'this.data.' + data.slug + '.' + name;
		
		if(field.field[0] === 'datetime') {
			convert.push('if(this.data.' + data.slug + ' && ' + variable + ') {');
			convert.push('    ' + variable + ' = ' + '_convertToControlDate(' + variable + ');');
			convert.push('}');
			return;
		}
		
		if(field.field[0] === 'date') {
			convert.push('if(this.data.' + data.slug + ' && ' + variable + ') {');
			convert.push('    ' + variable + ' = ' + '_convertToControlDate(' + variable + ', false, true);');
			convert.push('}');
			return;
		}
		
		if(field.field[0] === 'time') {
			convert.push('if(this.data.' + data.slug + ' && ' + variable + ') {');
			convert.push('    ' + variable + ' = ' + '_convertToControlDate(' + variable + ', true);');
			convert.push('}');
			return;
		}
	});
	
	return eden('string').replace(content, /{CONTROL_APP_CONVERT}/g	, convert.join("\n		"));
};