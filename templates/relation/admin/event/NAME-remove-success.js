define(function() {
	return function(e, {{from.schema.name}}, {{to.schema.name}}, request, action) {
		this.notify('Success', '{{to.schema.singular}} has been unlinked!', 'success');
		this.trigger('{{name}}-response', request, action);
		
		//is there a redirect?
		var redirect = false;
		
		//if the url has a ? and a redirect=
		if(request.url.indexOf('?') !== -1 
		&& request.url.indexOf('redirect=') !== -1) {
			//convert the query to hash
			var query = this.String().pathToQuery(request.url);
			
			//if there's a redirect value
			if(query.redirect && query.redirect.length) {
				//set the redirect to that
				redirect = query.redirect;
			}
		}
		
		if(redirect) {
			//redirect out
			this.redirect(redirect);
			
			return;
		}
		
		window.history.back();
	};
});