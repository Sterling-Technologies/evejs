define(function() {
	var c = function() {}, public = c.prototype;
	
	/* Public Properties 
	-------------------------------*/
	public.data 	= {};

	/* Private Properties
	-------------------------------*/
	var $ = jQuery;
	
	/* Loader
	-------------------------------*/
	public.__load = c.load = function() {
		return new c();
	};

	/* Construct
    -------------------------------*/
    /* Public Methods
    -------------------------------*/
	public.render = function() { 
        $.sequence()
			.setScope(this)
        	.then(_process);
        
        return this;
    };
	
    /* Private Methods
    -------------------------------*/
	var _process = function(next) {
		var post = controller.getPost();
		
		if(!post || !post.length) {
			controller.notify('Error', 'No bulk action chosen.', 'error');
			window.history.back();
			//do nothing
			return;
		}
		
		post = $.queryToHash(post);
		
		//if nothing was checked
		if(!post.action) {
			controller.notify('Error', 'No bulk action chosen.', 'error');
			window.history.back();
			//do nothing
			return;
		}
		
		
		//if nothing was checked
		if(!post.id || !post.id.length) {
			controller.notify('Error', 'No items were chosen.', 'error');
			window.history.back();
			//do nothing
			return;
		}
		
		//what is the url base
		var url =  '/post/' + post.action + '/';
		
		//prepare the batch query
		for(var batch = [], i = 0; i < post.id.length; i++) {
			batch.push({ url: url + post.id[i] });
		}
		
		//call the batch remove
		$.post(
		controller.getServerUrl() + '/post/batch', 
		JSON.stringify(batch), function(response) { 
			response = JSON.parse(response);
			for(var errors = false, i = 0; i < response.length; i++) {
				if(response[i].error && response[i].message) {
					errors = true;
					controller.notify('Error', response[i].message, 'error');
				}
			}
			
			if(!errors) {
				controller.notify('Success', 'Bulk Action ' + post.action + ' successful!', 'success');
			}
			
			window.history.back();
		});
	};
	
	/* Adaptor
	-------------------------------*/
	return c; 

});