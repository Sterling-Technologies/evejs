define(function() {
    var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;
    
    /* Public Properties 
    -------------------------------*/
    public.title        = 'Updating {SINGULAR}';
    public.header       = 'Updating {SINGULAR}';
    public.subheader    = 'CRM';
	
    public.crumbs = [{ 
        path: '/{SLUG}',
        icon: '{ICON}', 
        label: '{PLURAL}' 
    }, {  label: 'Update {SINGULAR}' }];
	
    public.data     = {};
	
    public.template = controller.path('{SLUG}/template') + '/form.html';
    
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
	public.__construct = function() {
		//reset data because of "pass by ref"
		this.data = {};
	};
    
	/* Public Methods
    -------------------------------*/
    public.render = function() {
        $.sequence()
			.setScope(this)
        	.then(_setData)
        	.then(_output);
        
        return this;
    };

    /* Private Methods
    -------------------------------*/
    var _setData = function(next) {
		this.data.mode 		= 'update';
		this.data.url 		= window.location.pathname;
		
		var data = controller.getPost();
		
		if(data && data.length) {
			//query to hash
			this.data.{SLUG} = $.queryToHash(data);
			
			//ENUMS
			{ENUMS}
			
			if(!_valid.call(this)) {			
				//display message status
				controller.notify('Error', 'There was an error in the form.', 'error');
				next();
				
				return;
			}
			
			//we are good to send this up
			_process.call(this, next);
			
			return;
		}
		
		//if no data {SLUG} set
		if(!this.data.{SLUG}) {
			//get it from the server
			//get {SLUG} id
			var id =  window.location.pathname.split('/')[3];
			var url = controller.getServerUrl() + '/{SLUG}/detail/'+id;
			
			$.getJSON(url, function(response) {
				this.data.{SLUG} = response.results;
				next();
			}.bind(this));
			
			return;
		}
		
        next();
    };
    
    var _output = function(next) {
		//store form templates path to array
        var templates = ['text!' + controller.path('{SLUG}/template') +  '/form.html'];

        //require form templates
        //assign it to main form
        require(templates, function(form) {
			//render the body
			var body = Handlebars.compile(form)(this.data);
			
			controller
				.setTitle(this.title)
				.setHeader(this.header)
				.setSubheader(this.subheader)
				.setCrumbs(this.crumbs)
				.setBody(body);            
			
			// fire this event whenever the update page of {SLUG} is available and fully loaded
			controller.trigger('{SLUG}-update-ready');

			next();
		}.bind(this));
    };

	var _valid = function() {
		//clear errors
		this.data.errors = {};
		
		//TODO: ADD VALIDATION HERE
		
		//if we have no errors
		return JSON.stringify(this.data.errors) == '{}';
	};
	
	var _process = function(next) {
		var id 		=  window.location.pathname.split('/')[3],
			url 	= controller.getServerUrl() + '/{SLUG}/update/'+id;
		
		//save data to database
		$.post(url, this.data.{SLUG}, function(response) {
			response = JSON.parse(response);
			
			if(!response.error) {		
				controller				
					//display message status
					.notify('Success', '{SINGULAR} successfully updated!', 'success')
					//go to listing
					.redirect('/{SLUG}');
				
				//no need to next since we are redirecting out
				return;
			}
			
			this.data.errors = response.validation || {};
			
			//display message status
			controller.notify('Error', 'There was an error in the form.', 'error');
			
			next();
	   }.bind(this));
	};
    
    /* Adaptor
    -------------------------------*/
    return c; 
});