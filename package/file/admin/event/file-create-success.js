define(function() {
	return function(e, id, request) {
		//yay done!
		this.notify('Success', 'File has been created!', 'success');
		//trigger generic response
		this.trigger('file-response', request);
		
		//is there a redirect?
		var redirect = '/file';
		
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