module.exports = function(settings, content, data) {
	var eden = settings.eden, copy = settings.copy;
	
	for(var key in copy.updated) {
		if(data.use_updated) {
			content = eden('string').replace(content, new RegExp('{USE_UPDATED_'+key.toUpperCase()+'}', 'g'), copy.updated[key][0]);
		}
		
		content = eden('string').replace(content, new RegExp('{USE_UPDATED_'+key.toUpperCase()+'}', 'g'), copy.updated[key][1]);
	}
	
	return content;
};