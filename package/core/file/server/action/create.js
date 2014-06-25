module.exports = (function() { 
	var c = function(controller, request, response) {
        this.__construct.call(this, controller, request, response);
    }, public = c.prototype;

	/* Public Properties
    -------------------------------*/
    public.controller  	= null;
    public.request   	= null;
    public.response  	= null;
    
	/* Private Properties
    -------------------------------*/
    /* Loader
    -------------------------------*/
    public.__load = c.load = function(controller, request, response) {
        return new c(controller, request, response);
    };
    
	/* Construct
    -------------------------------*/
	public.__construct = function(controller, request, response) {
		//set request and other usefull data
		this.controller = controller;
		this.request  	= request;
		this.response  	= response;
	};
	
	/* Public Methods
    -------------------------------*/
	public.render = function() {
		//1. SETUP: change the string into a native object
		var self = this, query = this
			.controller.eden.load('string')
			.queryToHash(this.request.message);
			
		//if the request has files
		if(this.request.files) {
			var orm 		= require('mongoose'),
				database 	= orm.connection.db,
				gridStore	= orm.mongo.GridStore,
				objectId	= orm.mongo.ObjectID,
				store		= null,
				id			= null;
			
			//get the files
			this.request.stream(function(name, mime) {
				id = new objectId();
				
				//callback for start
				store = new gridStore(
					database, id, name, 'w+', { 
						root: 'file', 
						chunk_size: 1024 * 4, 
						content_type: mime,
					});
			}, function(chunk) { 
				//callback for streaming
				store.write(chunk.toString());
			}, function() {
				store.close();
				//callback when the data has ended
				//setup an error response
				this.response.message = JSON.stringify({ error: false, results: id}); 
				
				//trigger that a response has been made
				this.controller.trigger('file-action-response', this.request, this.response);
			}.bind(this));
		}
		
		return;
		
		//2. TRIGGER
		this.controller
			//when there is an error 
			.once('file-create-error', function(error) {
				//setup an error response
				self.response.message = JSON.stringify({ 
					error: true, 
					message: error.message,
					validation: error.errors || [] });
				
				//dont listen for success anymore
				self.controller.unlisten('file-create-success');
				//trigger that a response has been made
				self.controller.trigger('file-action-response', self.request, self.response);
			})
			//when it is successfull
			.once('file-create-success', function() {
				//set up a success response
				self.response.message = JSON.stringify({ error: false });
				//dont listen for error anymore
				self.controller.unlisten('file-create-error');
				//trigger that a response has been made
				self.controller.trigger('file-action-response', self.request, self.response);
			})
			//Now call to remove the file
			.trigger('file-create', this.controller, query);
	};
	
	/* Private Methods
    -------------------------------*/
	/* Adaptor
	-------------------------------*/
	return c; 
})();