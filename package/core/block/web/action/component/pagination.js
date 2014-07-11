define(function() {
    var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;
    
    /* Public Properties 
    -------------------------------*/
    public.data     = {};
	public.callback = null;
	
    public.template = controller.path('block/template') + '/component/pagination.html';
    
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
    public.render = function(callback) {
		//the callback will be called in output
		this.callback = callback;
		
        $.sequence().setScope(this).then(_output);
        
        return this;
    };
	
	public.setType = function(type) {
		this.data.type = type;
		return this;
	};
	
	public.setData = function(total, range, attributes) {
		//get current query
		var query 		= {},
			current		= 1,
			queryString = window.location.href.split('?')[1];
		
		//if we have a query string
		if(queryString && queryString.length) {
			//make it into an object
			query = jQuery.queryToHash(queryString);
			//remember the current page
			current = query.page || 1;
		}
		
		//how many pages?
		var pages = Math.ceil(total / range);
		
		this.data.pages 		= pages;
		this.data.current 		= current;
		this.data.query 		= query;
		this.data.attributes 	= attributes || '';
		
		return this;
	};
	
	public.setInnerTemplate = function(template) {
		//make template an empty function
		//if not already defined
		template = template || $.noop;
		
		//call the template (Handlebars)
		//make sure attributes is a string otherwise
		this.data.innerTemplate = template() || '';
		
		return this;
	};

    /* Private Methods
    -------------------------------*/
    var _output = function(next) {
		//if there is one or less pages
		if(this.data.pages < 2) {
			//render nothing
			this.callback('');
			next();
			return;
		}
		
		//store form templates path to array
        var templates = ['text!' + this.template];
		
        //require form templates
        //assign it to main form
        require(templates, function(template) {
			this.data.items = [];
			for(var i = 0; i < this.data.pages; i++) {
				this.data.query.page = i + 1;
				this.data.items.push({
					page	: i + 1,
					active	: this.data.current == (i + 1), 
					query	: $.hashToQuery(this.data.query) });
			}
			
            //render
			this.callback(Handlebars.compile(template)(this.data));
				
			next();
		}.bind(this));
    };

    /* Adaptor
    -------------------------------*/
    return c; 
});