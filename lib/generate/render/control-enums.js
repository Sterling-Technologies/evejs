module.exports = function(settings, content, data) {
	var eden			= settings.eden,
		normalize 	= settings.normalize,	
		enums 			= [];
	
	//for each fields
	eden('hash').each(data.fields, function(name, field) {
		field = normalize(field);
		//if there is no enum
		if(!field.options || !(field.options instanceof Array)) {
			return;
		}
		
		list = JSON.stringify([[field.options]], null, 4);
		list = list.substr(16, list.length - 24);
		
		enums.push('this.data.' + name + 'List = ' + list + ';');
	});
	
	return eden('string').replace(content, /{CONTROL_ENUMS}/g	, enums.join("\n		"));
};