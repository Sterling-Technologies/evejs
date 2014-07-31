module.exports = function(settings, content, data) {
	var eden = settings.eden, copy = settings.copy;
	
	for(var key in copy.active) {
		if(data.use_active) {
			content = eden('string').replace(content, new RegExp('{USE_ACTIVE_'+key.toUpperCase()+'}', 'g'), copy.active[key][0]);
		}
		
		content = eden('string').replace(content, new RegExp('{USE_ACTIVE_'+key.toUpperCase()+'}', 'g'), copy.active[key][1]);
	}
	
	return content;
};