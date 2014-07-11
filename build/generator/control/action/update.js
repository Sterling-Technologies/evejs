define(function() {
    var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;
    
    /* Public Properties 
    -------------------------------*/
    public.title        = 'Updating Sample';
    public.header       = 'Updating Sample';
    public.subheader    = 'CRM';
	
    public.crumbs = [{ 
        path: '/sample',
        icon: 'facebook', 
        label: 'Samples' 
    }, {  label: 'Create Sample' }];
	
    public.data     = {};
	
    public.template = controller.path('sample/template') + '/form.html';
    
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
			var url = controller.getServerUrl() + '/sample/detail/'+id;
			
			$.getJSON(url, function(response) {
				
				this.data.sample = response.results;
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
		if (isNaN(this.data.sample.title) || this.data.sample.title > 4) {
			this.data.errors.title = { message: 'Title should be a number greater than 4'};
		}
		if(!this.data.sample.title || !this.data.sample.title.length) {
			this.data.errors.title = { message: 'Title cannot be empty.' };
		}

		if (isNaN(this.data.sample.detail) || this.data.sample.detail < 7) {
			this.data.errors.detail = { message: 'Detail should be a number lesser than 7'};
		}
		if(!this.data.sample.detail || !this.data.sample.detail.length) {
			this.data.errors.detail = { message: 'Detail cannot be empty.' };
		}

		if ((new RegExp('/^(?:(?:(?:[^@,"\[\]\x5c\x00-\x20\x7f-\xff\.]|\x5c(?=[@,"\[\]'
				+ '\x5c\x00-\x20\x7f-\xff]))(?:[^@,"\[\]\x5c\x00-\x20\x7f-\xff\.]|(?<=\x5c)[@,"\[\]'
				+ '\x5c\x00-\x20\x7f-\xff]|\x5c(?=[@,"\[\]\x5c\x00-\x20\x7f-\xff])|\.(?=[^\.])){1,62'
				+ '}(?:[^@,"\[\]\x5c\x00-\x20\x7f-\xff\.]|(?<=\x5c)[@,"\[\]\x5c\x00-\x20\x7f-\xff])|'
				+ '[^@,"\[\]\x5c\x00-\x20\x7f-\xff\.]{1,2})|"(?:[^"]|(?<=\x5c)"){1,62}")@(?:(?!.{64})'
				+ '(?:[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.?|[a-zA-Z0-9]\.?)+\.(?:xn--[a-zA-Z0-9]'
				+ '+|[a-zA-Z]{2,6})|\[(?:[0-1]?\d?\d|2[0-4]\d|25[0-5])(?:\.(?:[0-1]?\d?\d|2[0-4]\d|25'
				+ '[0-5])){3}\])$/', 'ig')).test(this.data.sample.email)) {
			this.data.errors.email = { message: 'Email should be a valid email.' };
		}

		if(!this.data.sample.bio || !this.data.sample.bio.length) {
			this.data.errors.bio = { message: 'Bio cannot be empty.' };
		}

		try {
			$.datepicker.parseDate('dd/dd/dddd', this.data.sample.published);
		}
		catch(er) {
			this.data.errors.published = { message: 'Published must be date as dd/dd/dddd'};
		}


		
		//if we have no errors
		return JSON.stringify(this.data.errors) == '{}';
	};
	
	var _process = function(next) {
		var id 		=  window.location.pathname.split('/')[3],
			url 	= controller.getServerUrl() + '/sample/update/'+id;
		
		//save data to database
		$.post(url, this.data.sample, function(response) {
			response = JSON.parse(response);
			
			if(!response.error) {		
				controller				
					//display message status
					.notify('Success', 'Sample successfully created!', 'success')
					//go to listing
					.redirect('/sample');
				
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