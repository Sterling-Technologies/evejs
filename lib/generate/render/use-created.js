module.exports = function(settings, content, data) {
	var eden = settings.eden, copy = settings.copy;
	
	for(var key in copy.created) {
		if(data.use_created) {
			content = eden('string').replace(content, new RegExp('{USE_CREATED_'+key.toUpperCase()+'}', 'g'), copy.created[key][0]);
		}
		
		content = eden('string').replace(content, new RegExp('{USE_CREATED_'+key.toUpperCase()+'}', 'g'), copy.created[key][1]);
	}
	
	return content;
};