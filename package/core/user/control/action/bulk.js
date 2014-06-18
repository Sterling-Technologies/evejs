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
			controller.addMessage('No bulk action chosen.', 'danger', 'exclamation-sign');
			window.history.back();
			//do nothing
			return;
		}
		
		post = $.queryToHash(post);
		
		//if nothing was checked
		if(!post.action) {
			controller.addMessage('No bulk action chosen.', 'danger', 'exclamation-sign');
			window.history.back();
			//do nothing
			return;
		}
		
		
		//if nothing was checked
		if(!post.id || !post.id.length) {
			controller.addMessage('No items were chosen.', 'danger', 'exclamation-sign');
			window.history.back();
			//do nothing
			return;
		}
		
		//what is the url base
		var url =  '/user/' + post.action + '/';
		
		//prepare the batch query
		for(var batch = [], i = 0; i < post.id.length; i++) {
			batch.push({ url: url + post.id[i] });
		}
		
		//call the batch remove
		$.post(
		controller.getServerUrl() + '/user/batch', 
		JSON.stringify(batch), function(response) { 
			response = JSON.parse(response);
			for(var errors = false, i = 0; i < response.length; i++) {
				if(response[i].error && response[i].message) {
					errors = true;
					controller.addMessage(response[i].message, 'danger', 'exclamation-sign');
				}
			}
			
			if(!errors) {
				controller.addMessage('Bulk Action ' + post.action + ' successful!', 'success', 'check');
			}
			
			window.history.back();
		});
	};
	
	/* Adaptor
	-------------------------------*/
	return c; 

});