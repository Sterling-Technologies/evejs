define(function() {
	return function(e, results, request, action) {
		//save token to cookie
		this.cookie('auth', results.auth);
		
		//trigger generic response
		this.trigger('auth-response', request);
		
		//is there a redirect?
		var redirect = '/';
		
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