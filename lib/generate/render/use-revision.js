module.exports = function(settings, content, data) {
	var eden		= settings.eden,
		copy 		= settings.copy,
		normalize 	= settings.normalize,
		convert 	= [];
		
	//for each fields
	eden('hash').each(data.fields, function(name, field) {
		field = normalize(field);
		
		var variable = 'revisions[i].' + name;
		
		if(field.field[0] === 'date') {
			convert.push('if(' + variable + ') {');
			convert.push('    ' + variable + ' = ' + '_convertToControlDate(' + variable + ', false, true);');
			convert.push('}');
			return;
		} else if(field.field[0] === 'time') {
			convert.push('if(' + variable + ') {');
			convert.push('    ' + variable + ' = ' + '_convertToControlDate(' + variable + ', true);');
			convert.push('}');
			return;
		} else if(field.field[0] === 'datetime' || field.type === 'date') {
			convert.push('if(' + variable + ') {');
			convert.push('    ' + variable + ' = ' + '_convertToControlDate(' + variable + ');');
			convert.push('}');
			return;
		}
	});
	
	content = eden('string').replace(content, /{USE_REVISION_APP_CONVERT}/g	, convert.join("\n				"));
	
	for(var key in copy.revision) {
		if(data.use_revision) {
			content = eden('string').replace(content, new RegExp('{USE_REVISION_'+key.toUpperCase()+'}', 'g'), copy.revision[key][0]);
		}
		
		content = eden('string').replace(content, new RegExp('{USE_REVISION_'+key.toUpperCase()+'}', 'g'), copy.revision[key][1]);
	}
	
	return content;
};
