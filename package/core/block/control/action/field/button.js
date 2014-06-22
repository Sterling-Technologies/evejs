define(function() {
    var c = function() {
		this.__construct.call(this);
	}, public = c.prototype;
    
    /* Public Properties 
    -------------------------------*/
    public.data     = {};
	public.callback = null;
	
    public.template = controller.path('block/template') + '/field/button.html';
    
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
	
	public.setData = function(attributes) {
		this.data.attributes 	= attributes || '';
		
		return this;
	};
	
	public.setInnerTemplate = function(template) {
		//make template an empty function
		//if not already defined
		template = template || $.noop;
		
		//call the template (Handlebars)
		//make sure attributes is a string otherwise
		this.data.innerTemplate = template({}) || '';
		
		return this;
	};

    /* Private Methods
    -------------------------------*/
    var _output = function(next) {
		//store form templates path to array
        var templates = ['text!' + this.template];
		
		//add the ace admin class
		this.data.attributes = _addAttribute(
		this.data.attributes, 'class', 'btn');
		
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