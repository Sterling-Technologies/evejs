define(function() {
    var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;
    
    /* Public Properties 
    -------------------------------*/
    public.data     = {};
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
		//the callback will be called in output
		this.callback = callback;
		
        $.sequence().setScope(this).then(_output);
        
        return this;
    };
	
	public.setData = function(name, options, value, attributes) {
		this.data.name 			= name;
		this.data.options 		= options;
		this.data.value 		= value;
		this.data.attributes 	= attributes || '';
		
		if(typeof options == 'string') {
			this.data.options = this.data.options.split('|');
			for(var i = 0; i < this.data.options.length; i++) {
				this.data.options[i] = {
					value	: this.data.options[i],
					label	: this.data.options[i].substr(0, 1).toUpperCase() 
							+ this.data.options[i].substr(1) 
				};
			}
		} else if(typeof options == 'object') {
			for(var i = 0; i < options.length; i++) {
				this.data.options[i] = {
					value	: options[i]._id,
					label	: options[i].name
				};
			}
		}
		
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
		//store form templates path to array
        var templates = ['text!' + this.template];
		
		//add the ace admin class
		this.data.attributes = _addAttribute(
		this.data.attributes, 'class', 'form-control');
		
        //require form templates
        //assign it to main form
        require(templates, function(template) {
            //render
			this.callback(Handlebars.compile(template)(this.data));
				
			next();
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