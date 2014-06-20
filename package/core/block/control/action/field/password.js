define(function() {
    var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;
    
    /* Public Properties 
    -------------------------------*/
    public.data     = {};
	public.inner 	= controller.noop;
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
		this.callback = callback;
		
        $.sequence()
			.setScope(this)
        	.then(_output)
			.then(_listen);
        
        return this;
    };
	
	public.setData = function(name, value) {
		this.data.name 		= name;
		this.data.value 	= value;
		this.data.type		= 'password';
		return this;
	};
	
	public.setInnerTemplate = function(template) {
		this.data.inner = template;
		return this;
	};

    /* Private Methods
    -------------------------------*/
    var _output = function(next) {
		//load up the action
		require([controller.path('block/action') + '/field/text.js'], function(action) {
			action = action.load();
			action.setData(this.data.name, this.data.value, this.data.type);
			action.setInnerTemplate(this.data.inner);
			action.render(function(html) {
				this.callback(html);
				next();
			}.bind(this));
		}.bind(this));
    };

    var _listen = function(next) {
	   	next();
    };
		
    /* Adaptor
    -------------------------------*/
    return c; 
});