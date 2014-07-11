define(function() {
    var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;
    
    /* Public Properties 
    -------------------------------*/
    public.title        = 'Create {SINGULAR}';
    public.header       = 'Create {SINGULAR}';
    public.subheader    = '';
	
    public.crumbs = [{ 
        path: '/{SLUG}',
        icon: '{ICON}', 
        label: '{PLURAL}' 
    }, {  label: 'Create {SINGULAR}' }];
	
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
			.then(_setCountries)
        	.then(_setData)
        	.then(_output)
			.then(_listen);
        
        return this;
    };

    /* Private Methods
    -------------------------------*/
    var _setData = function(next) {
		this.data.mode 		= 'create';
		this.data.url 		= window.location.pathname;
		this.data.country 	= this.countries;
		
		var post = controller.getPost();
		
		if(post && post.length) {
			//query to hash
			this.data.{SLUG} = $.queryToHash(post);
			
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
		
        next();
    };
    
    var _output = function(next) {
		//store form templates path to array
        var templates = [ 'text!' + this.template ];

        //require form templates
        //assign it to main form
        require(templates, function(form) {
            var body = Handlebars.compile(form)(this.data);
			
			controller
				.setTitle(this.title)
				.setHeader(this.header)
				.setSubheader(this.subheader)
				.setCrumbs(this.crumbs)
				.setBody(body);            
				
			next();
		}.bind(this));
    };

    var _listen = function(next) {
	   	
	    next();
    };
	
	var _valid = function() {
		//clear errors
		this.data.errors = {};
		
		//local validations
{VALIDATION}
		
		//if we have no errors
		return JSON.stringify(this.data.errors) == '{}';
	};
	
	var _process = function(next) {
		var url = controller.getServerUrl() + '/{SLUG}/create';
		
		//don't store the confirm
		delete this.data.{SLUG}.confirm;
		
		//save data to database
		$.post(url, this.data.{SLUG}, function(response) {
			response = JSON.parse(response);
			
			if(!response.error) {		
				controller				
					//display message status
					.notify('Success', '{SINGULAR} successfully created!', 'success')
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