define(function() {
    var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;
    
    /* Public Properties 
    -------------------------------*/
    public.title        = 'Updating {{TEMPORARY}}';
    public.header       = 'Updating {{TEMPORARY}}';
    public.subheader    = 'CRM';
	
    public.crumbs = [{ 
        path: '/{TEMPORARY}',
        icon: '{TEMPORARY}', 
        label: '{TEMPORARY}' 
    }, {  label: 'Create {TEMPORARY}' }];
	
    public.data     = {};
	
    public.template = controller.path('{TEMPORARY}/template') + '/form.html';
    
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
        	.then(_output)
			.then(_listen);
        
        return this;
    };

    /* Private Methods
    -------------------------------*/
    var _setData = function(next) {
		this.data.mode 		= 'update';
		this.data.url 		= window.location.pathname;
		
		var post = controller.getPost();
		
		if(post && post.length) {
			//query to hash
			this.data.{TEMPORARY} = $.queryToHash(post);
			
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
		
		//if no data post set
		if(!this.data.{TEMPORARY}) {
			//get it from the server
			//get {TEMPORARY} id
			var id =  window.location.pathname.split('/')[3];
			var url = controller.getServerUrl() + '/{TEMPORARY}/detail/'+id;
			
			$.getJSON(url, function(response) {
				//format the birth to the HTML5 date format
				if(response.results.published 
				&& (new Date(response.results.published)).getTime() > 0) {
					//convert date format
					var published 	= new Date(response.results.published);
					
					var year 	= birth.getFullYear(),
						month 	= birth.getMonth() < 9 ? '0'+(birth.getMonth() + 1) : (birth.getMonth() + 1),
						day 	= birth.getDate() < 10 ? '0'+(birth.getDate()) : (birth.getDate());
					
					response.results.published = [year, month, day].join('-');
				} else {
					response.results.published = null;
				}
				
				this.data.{TEMPORARY} = response.results;
				
				next();
			}.bind(this));
			
			return;
		}
		
        next();
    };
    
    var _output = function(next) {
		//store form templates path to array
        var templates = [];

        //require form templates
        //assign it to main form
        require(templates, function(form) {
   
			var body = Handlebars.compile(form)(this.data);
			
			controller
				.setTitle(this.title.replace('{{TEMPORARY}}', this.data.{TEMPORARY}.title))
				.setHeader(this.header.replace('{{TEMPORARY}}', this.data.{TEMPORARY}.title)) 
				.setSubheader(this.subheader)
				.setCrumbs(this.crumbs)
				.setBody(body);            
				
			next();
		}.bind(this));
    };

    var _listen = function(next) {
	   	$('form.package-{TEMPORARY}-form').on('keyup', 'input[name="title"]', function(e) {
			var name = $(this);
			//there's a delay in when the input value is updated
			//we do this settime out to case for this
			setTimeout(function() {
				$('form.package-{TEMPORARY}-form input[name="slug"]').val($.trim(name.val()
				.toLowerCase()
				.replace(/[^a-zA-Z0-9-_ ]/g, ''))
				.replace(/\s/g, '-')
				.replace(/^([a-z\u00E0-\u00FC])|\-([a-z\u00E0-\u00FC])/g, function ($1) {
					return $1.toLowerCase();
				}));
			}, 1);
		});
	   
	    next(); 
    };
	
	var _valid = function() {
		//clear errors
		this.data.errors = {};
		
		/*
        validation here
        */
		
		//if we have no errors
		return JSON.stringify(this.data.errors) == '{}';
	};
	
	var _process = function(next) {
		var id 		=  window.location.pathname.split('/')[3],
			url 	= controller.getServerUrl() + '/{TEMPORARY}/update/'+id;
		
		if(this.data.{TEMPORARY}.published) {
			this.data.{TEMPORARY}.published += 'T00:00:00Z';
		}
		
		//save data to database
		$.post(url, this.data.{TEMPORARY}, function(response) {
			response = JSON.parse(response);
			
			if(!response.error) {		
				controller				
					//display message status
					.notify('Success', '{TEMPORARY} successfully created!', 'success')
					//go to listing
					.redirect('/{TEMPORARY}');
				
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