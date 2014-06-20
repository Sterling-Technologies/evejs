define(function() {
    var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;
    
    /* Public Properties 
    -------------------------------*/
    public.data     = {};
	public.inner 	= controller.noop;
	public.callback = null;
	
    public.template = controller.path('block/template') + '/field/select.html';
    
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
		this.callback = callback;
		
        $.sequence()
			.setScope(this)
        	.then(_output)
			.then(_listen);
        
        return this;
    };
	
	public.setData = function(name, options, value) {
		this.data.name 		= name;
		this.data.options 	= options;
		this.data.value 	= value;
		
		return this;
	};
	
	public.setInnerTemplate = function(template) {
		this.data.attributes = template();
		return this;
	};

    /* Private Methods
    -------------------------------*/
    var _output = function(next) {
		//store form templates path to array
        var templates = ['text!' + this.template];

        //require form templates
        //assign it to main form
        require(templates, function(template) {
            //render
			this.callback(Handlebars.compile(template)(this.data));
				
			next();
		}.bind(this));
    };

    var _listen = function(next) {
	   	next();
    };
    
    /* Adaptor
    -------------------------------*/
    return c; 
});