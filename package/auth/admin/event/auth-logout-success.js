define(function() {
	return function(e, request, action) {
		//trigger generic response
		this.trigger('auth-response', request);
		
		//is there a redirect?
		var redirect = '/auth/login';
		
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
		window.location = redirect;
	};
});