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
		
        $.sequence()
			.setScope(this)
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
		//add required to attributes
		this.data.attributes = _addAttribute(this.data.attributes, 'min', this.data.min, true);
		this.data.attributes = _addAttribute(this.data.attributes, 'max', this.data.max, true);
		this.data.attributes = _addAttribute(this.data.attributes, 'step', this.data.step, true);
		
		this.data.attributes = _addAttribute(
		this.data.attributes, 'class', 'eve-field-slider');
		
		//load up the action
		require([controller.path('block/action') + '/field/text.js'], function(action) {
			//load the action
			action.load()
			//set the input type
			.setType('range')
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
		var counter = $('<div>')
			.css('margin-bottom', '-12px')
			.css('font-size', '11px')
			.html(this.data.value || this.data.min);
			
		//find all the widgets
		$('input.eve-field-slider')
			//remove the ones already set
			.not('.eve-field-loaded')
			//mark this as set
			.addClass('eve-field-loaded')
			//invoke the widget
			.before(counter)
			.change(function() {
				counter.html($(this).val());
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