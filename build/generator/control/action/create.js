define(function() {
    var Definition = function() {
		this.__construct.call(this);
	}, prototype = Definition.prototype;
    
    /* Public Properties 
    -------------------------------*/
    prototype.title        = 'Create {{singular}}';
    prototype.header       = 'Create {{singular}}';
    prototype.subheader    = 'CRM';
	
    prototype.crumbs = [{ 
        path: '/{{name}}',
        icon: '{{icon}}', 
        label: '{{plural}}' 
    }, {  label: 'Create {{singular}}' }];
	
    prototype.data     = {};
	
    prototype.template = controller.path('{{name}}/template') + '/form.html';
    
    /* Private Properties
    -------------------------------*/
    var $ = jQuery;
	
    /* Loader
    -------------------------------*/
    prototype.__load = Definition.load = function() {
        return new Definition();
    };
    
    /* Construct
    -------------------------------*/
	prototype.__construct = function() {
		//reset data because of "pass by ref"
		this.data = {};
	};
    
	/* Public Methods
    -------------------------------*/
    prototype.render = function() {
        $.sequence()
			.setScope(this)
        	.then(_setData)
        	.then(_output);
        
        return this;
    };

    /* Private Methods
    -------------------------------*/
    var _setData = function(next) {
		this.data.mode 		= 'create';
		this.data.url 		= window.location.pathname;
		this.data.{{name}}	= {};
		
		//NOTE: BULK GENERATE
		{{~#loop fields ~}} 
			{{~#if value.default ~}} 
				{{~#when value.default '==' 'now()'}}
		this.data.{{../../../name}}.{{../../key}} = _convertToControlDate(Date.now());
				{{~/when~}} 
				{{~#when value.default '!=' 'now()'}}
		this.data.{{../../../name}}.{{../../key}} = {{../../value.default}};
				{{~/when~}} 
			{{~/if~}} 
		{{~/loop}}
		
		var data = controller.getPost();
		var files = controller.getFiles();
		
		if(data && data.length) {
			//query to hash
			this.data.{{name}} = $.queryToHash(data);
			this.data.files = files;
			
			if(!_valid.call(this)) {			
				//display message status
				controller.notify('Error', 'There was an error in the form.', 'error');
				
				next();
				
				return;
			}
			
			//we are good to send this up
			_process.call(this, next);
			
			return;
		}
		
        next();
    };
    
    var _output = function(next) {
		//store form templates path to array
        var templates = ['text!' + controller.path('{{name}}/template') +  '/form.html'];
		
		//ENUMS
		//NOTE: BULK GENERATE
		{{#loop fields ~}} 
			{{~#if value.options ~}} 
			
		this.data.{{../key}}List = [
			{{#loop ../value.options ~}}
			{ label: '{{value.label}}', value: '{{value.value}}' }
			{{~#unless last}},
			{{/unless~}}
			{{/loop~}}
		];
				 
			{{~/if~}} 
		{{~/loop}}
		
		//CONTROL CONVERT
		//NOTE: BULK GENERATE
		{{#loop fields ~}}
		{{~#if value.field ~}}
		{{~#when value.field.[0] '==' 'datetime' ~}}
		if(this.data.{{../../../name}} && this.data.{{../../../name}}.{{../../key}}) {
			this.data.{{../../../name}}.{{../../key}} = _convertToControlDate(this.data.{{../../../name}}.{{../../key}});
		}
		
		{{/when~}}
		{{~#when value.field.[0] '==' 'date' ~}}
		if(this.data.{{../../../name}} && this.data.{{../../../name}}.{{../../key}}) {
			this.data.{{../../../name}}.{{../../key}} = _convertToControlDate(this.data.{{../../../name}}.{{../../key}}, false, true);
		}
		
		{{/when~}}
		{{~#when value.field.[0] '==' 'time' ~}}
		if(this.data.{{../../../name}} && this.data.{{../name}}.{{../../key}}) {
			this.data.{{../../../name}}.{{../../key}} = _convertToControlDate(this.data.{{../../../name}}.{{../../key}}, true);
		}
		
		{{/when~}}
		{{~/if~}}
		{{~/loop}}
			
        //require form templates
        //assign it to main form
        require(templates, function(form) {
            //render the body
			var body = Handlebars.compile(form)(this.data);
			
			controller
				.setTitle(this.title)
				.setHeader(this.header)
				.setSubheader(this.subheader)
				.setCrumbs(this.crumbs)
				.setBody(body);            
				
			next();
		}.bind(this));
    };
	
	var _valid = function() {
		//VALIDATION
		this.data.errors = controller.{{name}}.getErrors(this.data.{{name}});
		
		//if we have no errors
		return JSON.stringify(this.data.errors) === '{}';
	};
	
	var _process = function(next) {
		controller.{{name}}.create(this.data.{{name}}, this.data.files, function(error, percent, response) {
			//if there is an error
			if(error) {
				//Add to gritter
				controller.notify('Form Error', error, 'error');
				next();
				return;
			}
			
			//if it is in progress
			if(!response) {
				//Add to gritter
				controller.notify('Submitting Form', percent + '%', 'info');
				return;
			}
			
			if(!response.error) {		
				controller				
					//display message status
					.notify('Success', '{{singular}} successfully created!', 'success')
					//go to listing
					.redirect('/{{name}}');
				
				//no need to next since we are redirecting out
				return;
			}
			
			if(response.validation && response.validation instanceof Array) {
				this.data.errors = {};
				for(var j, i = 0; i < response.validation.length; i++) {
					for(j in response.validation[i]) {
						if(response.validation[i].hasOwnProperty(j)) {
							this.data.errors[j] = response.validation[i][j];
						}
					}	
				}
			}
			
			//display message status
			controller.notify('Error', 'There was an error in the form.', 'error');
			
			next();
		});
	};
	
	var _convertToControlDate = function(string, noDate, noTime) {
		if(typeof string !== 'number') {
			string = '' + string;
			if(!string || !string.length) {
				return '';
			}
		}
		
		var date 	= new Date(string);
		var month 	= (date.getMonth() + 1) + '';
		var day 	= date.getDate() + '';
		var year 	= date.getFullYear();	
		
		var hour 	= date.getHours() + '';
		var minute = date.getMinutes() + '';
		
		if(month.length === 1) {
			month = '0' + month;
		}
		
		if(day.length === 1) {
			day = '0' + day;
		}
		
		if(hour.length === 1) {
			hour = '0' + hour;
		}
		
		if(minute.length === 1) {
			minute = '0' + minute;
		}
		
		date = month + '/' + day + '/' + year;
		var time = hour + ':' + minute;
		
		if(noDate) {
			return time;
		}
		
		if(noTime) {
			return date;
		}
		
		return date + ' ' + time;
	};
    
    /* Adaptor
    -------------------------------*/
    return Definition; 
});