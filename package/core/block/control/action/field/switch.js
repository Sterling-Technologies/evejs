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
	
	public.setData = function(name, value, selected, type, attributes) {
		this.data.name 			= name;
		this.data.value 		= value;
		this.data.attributes 	= attributes || '';
		this.data.selected		= selected;
		
		if(selected instanceof Array) {
			for(var i = 0; i < selected.length; i++) {
				if(value == selected[i]) {
					this.data.attributes = _addAttribute(
					this.data.attributes, 'selected', 'selected');
					
					return this;
				}
			}
			
			return this;
		}
		
		type = type || 1;
		
		this.data.attributes = _addAttribute(this.data.attributes, 
		'class', 'ace-switch ace-switch-' + type);
		
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
		require([controller.path('block/action') + '/field/checkbox.js'], function(action) {
			//load the action
			action.load()
			//set the data needed
			.setData(
				this.data.name, 
				this.data.value, 
				this.data.selected,
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