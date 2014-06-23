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
	public.loadAssets = function(callback) {
		//make sure callback is a function
		callback = callback || $.noop;
		
		//if loaded
		if(_loaded) {
			//do nothing
			callback();
			return this;
		}
		
		//add script to header
		//<script type="text/javascript" src="/scripts/autocomplete.js">script>
		$('<script type="text/javascript"></script>')
			.attr('src', controller.path('block/asset') + '/scripts/number.js')
			.appendTo('head');
		
		_loaded = true;
		
		callback();
		
		return this;
	};
	
    public.render = function(callback) {
		//the callback will be called in output
		this.callback = callback;
		
        $.sequence()
			.setScope(this)
			.then(this.loadAssets)
			.then(_output)
			.then(_listen);
        
        return this;
    };
	
	public.setData = function(name, value, min, max, step, attributes) {
		this.data.name 			= name;
		this.data.value 		= value;
		this.data.attributes 	= attributes || '';
		this.data.min			= min || '0';
		this.data.max			= max || '0';
		this.data.step			= step || '0';
		
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
		this.data.attributes = _addAttribute(
		this.data.attributes, 'class', 'eve-field-number');
		
		//load up the action
		require([controller.path('block/action') + '/field/text.js'], function(action) {
			//load the action
			action.load()
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
	
	var _listen = function(next) {
		var self = this;
		//find all the widgets
		$('input.eve-field-number')
			//remove the ones already set
			.not('.eve-field-loaded')
			//mark this as set
			.addClass('eve-field-loaded')
			//invoke the widget
			.ace_spinner({
				//FUEL_UX SPINNER options
				value			: parseInt(this.data.value),
				min				: parseInt(this.data.min),
				max				: parseInt(this.data.max),
				step			: parseInt(this.data.step),
				
				// + custom ones
				icon_up			: 'icon-plus',//default : 'icon-chevron-up'
				icon_down		: 'icon-minus',// default : 'icon-chevron-down'
				btn_up_class	: 'btn-success',//default : ''
				btn_down_class	: 'btn-danger',//default : ''
				
				on_sides: false,//will show decrement button on left and the other one on right
				touch_spinner: false// will use larger buttons by default
			}).keydown(function(e) {
				//go up
				if(e.keyCode == 38) {
					e.preventDefault();
					$(this).val(parseInt($(this).val()) + parseInt(self.data.step));
					//go down
				
				} else if(e.keyCode == 40) {
					$(this).val(parseInt($(this).val()) - parseInt(self.data.step));
				}
			});
		
	   	next();
    };
	
	var _addAttribute = function(attributes, key, value, verbose) {
		//we are attempting to inject a new class name
		if(attributes.indexOf(key + '=') == -1) {
			//freely prepend to attributes
			return attributes + ' ' + key + '="' + value + '"';
		}
		
		//the key already exists
		
		//is it a class ?
		if(key == 'class') {
			//the class name exists
			//so try to prepend in the class instead
			return attributes
				.replace('class="', 'class="'+value+' ')
				.replace("class='", "class='"+value+" ");
		}
		
		if(!verbose) {
			return attributes;
		}
		
		var match = (new RegExp(key + '="([^"]*)"', 'ig')).exec(attributes);
		
		//try to replace the attribute
		return attributes.replace(match[0], key + '="'+value+'"');
	};
		
    /* Adaptor
    -------------------------------*/
    return c; 
});