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
		this.data.mode 		= 'update';
		this.data.url 		= window.location.pathname;
		this.data.country 	= this.countries;
		
		var post = controller.getPost();
		
		if(post && post.length) {
			//query to hash
			this.data.user = $.queryToHash(post);
			
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
		
		//if no data user set
		if(!this.data.user) {
			//get it from the server
			//get user id
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
        var templates = [ 'text!' + this.template ];

        //require form templates
        //assign it to main form
        require(templates, function(form) {
            //render the body
			var body = Handlebars.compile(form)(this.data);
			
			controller
				.setTitle(this.title.replace('{USER}', this.data.user.name))
				.setHeader(this.header.replace('{USER}', this.data.user.name))
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
		
		//NOTE: local validate
		
		//if we have no errors
		return JSON.stringify(this.data.errors) == '{}';
	};
	
	var _process = function(next) {
		var id 		=  window.location.pathname.split('/')[3],
			url 	= controller.getServerUrl() + '/user/update/'+id;
		
		//don't store the confirm
		delete this.data.user.confirm;
		
		if(this.data.user.birthdate) {
			this.data.user.birthdate += 'T00:00:00Z';
		}
		
		//save data to database
		$.post(url, this.data.user, function(response) {
			response = JSON.parse(response);
			
			if(!response.error) {		
				controller				
					//display message status
					.notify('Success', 'User successfully created!', 'success')
					//go to listing
					.redirect('/user');
				
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