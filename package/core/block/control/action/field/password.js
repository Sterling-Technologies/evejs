define(function() {
    var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;
    
    /* Public Properties 
    -------------------------------*/
    public.data     = {};
	public.callback = null;
    
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
	
	public.setData = function(name, value, attributes) {
		this.data.name 			= name;
		this.data.value 		= value;
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
		//load up the action
		require([controller.path('block/action') + '/field/text.js'], function(action) {
			//load the action
			action.load()
			//set the input type
			.setType('password')
			//set the data needed
			.setData(
				this.data.name, 
				this.data.value, 
				this.data.attributes)
			//pass the attributes along
			.setInnerTemplate(function() {
				return this.data.innerTemplate;
			}.bind(this))
			//render the text field
			.render(function(html) {
				//call the callback set in render
				this.callback(html);
				
				//continue with sequence
				next();
			}.bind(this));
		}.bind(this));
    };
		
    /* Adaptor
    -------------------------------*/
    return c; 
});