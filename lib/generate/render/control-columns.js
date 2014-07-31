module.exports = function(settings, content, data) {
	var eden = settings.eden, columns = [];
	//for each fields
	eden('hash').each(data.fields, function(name, field) {
		if(field.field instanceof Array 
		&& (field.field[0] == 'textarea'
		|| field.field[0] == 'wysiwyg'
		|| field.field[0] == 'markdown')) {
			return;
		}
		
		columns.push('<td>{{'+name+'}}</td>');
	});
	
	return eden('string').replace(content, /{CONTROL_COLUMNS}/g	, columns.join("\n                        "));
};