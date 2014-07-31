module.exports = function(settings, content, data) {
	var eden = settings.eden, copy = settings.copy;
	
	for(var key in copy.slug) {
		if(data.use_slug) {
			content = eden('string').replace(content, new RegExp('{USE_SLUG_'+key.toUpperCase()+'}', 'g'), copy.slug[key][0]);
		}
		
		content = eden('string').replace(content, new RegExp('{USE_SLUG_'+key.toUpperCase()+'}', 'g'), copy.slug[key][1]);
	}
	
	return content;
};
