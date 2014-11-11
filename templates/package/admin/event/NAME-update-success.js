define(function() {
	return function(e, request, action) {
		//yay done!
		this.notify('Success', '{{singular}} has been updated!', 'success');
		//trigger generic response
		this.trigger('{{name}}-response', request);
		
		//is there a redirect?
		var redirect = '/{{name}}';
		
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
		
		//redirect out
		this.redirect(redirect);
	};
});