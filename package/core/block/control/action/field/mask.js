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
	
	var _loaded = false;
	
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
	
	public.setData = function(name, pattern, value) {
		this.data.name 		= name;
		this.data.pattern	= pattern;
		this.data.value 	= value;
		return this;
	};
	
	public.setInnerTemplate = function(template) {
		this.data.inner = template;
		return this;
	};

    /* Private Methods
    -------------------------------*/
    var _output = function(next) {
		//if this is the first time
		if(!_loaded) {
			//add the style to header
			//<link rel="stylesheet" type="text/css" href="<?php echo $cdn(); ?>/styles/mask.css" />
			$('<link rel="stylesheet" type="text/css" />')
				.attr('href', controller.path('block/asset') + '/styles/mask.css')
				.appendTo('head');
			
			//add script to header
			//<script type="text/javascript" src="<?php echo $cdn(); ?>/scripts/mask.js">script>
			$('<script type="text/javascript"></script>')
				.attr('src', controller.path('block/asset') + '/scripts/mask.js')
				.appendTo('head');
		}
		
		//load up the action
		require([controller.path('block/action') + '/field/text.js'], function(action) {
			action = action.load();
			
			action.setData(this.data.name, this.data.value);
			
			action.setInnerTemplate(function() {
				return 'class="eden-field-mask" ' + this.data.inner();
			}.bind(this));
			
			action.render(function(html) {
				this.callback(html);
				next();
			}.bind(this));
		}.bind(this));
    };

    var _listen = function(next) {
		$('input.eden-field-mask')
			.not('.eden-field-loaded')
			.addClass('eden-field-loaded')
			.inputmask({ mask: this.data.pattern });
			
	   	next();
    };
		
    /* Adaptor
    -------------------------------*/
    return c; 
});