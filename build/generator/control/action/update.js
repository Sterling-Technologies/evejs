define(function() {
    var Definition = function() {
		this.__construct.call(this);
	}, prototype = Definition.prototype;
    
    /* Public Properties 
    -------------------------------*/
    prototype.title        = 'Updating {{singular}}';
    prototype.header       = 'Updating {{singular}}';
    prototype.subheader    = 'CRM';
	
    prototype.crumbs = [{ 
        path: '/{{name}}',
        icon: '{{icon}}', 
        label: '{{plural}}' 
    }, {  label: 'Update {{singular}}' }];
	
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
		this.data.mode 		= 'update';
		this.data.url 		= window.location.pathname;
		
		var data = controller.getPost();
		
		if(data && data.length) {
			//query to hash
			this.data.{{name}} = $.queryToHash(data);
			
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
		
		//if no data {{name}} set
		if(!this.data.{{name}}) {
			//get it from the server
			//get {{name}} id
			var id =  window.location.pathname.split('/')[3];
			
			controller.{{name}}.getDetail(id, function(response) {
				this.data.{{name}} = response.results;
				next();
			}.bind(this));
			
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
		if(this.data.{{../../../slug}} && this.data.{{../../../slug}}.{{../../key}}) {
			this.data.{{../../../slug}}.{{../../key}} = _convertToControlDate(this.data.{{../../../slug}}.{{../../key}});
		}
		
		{{/when~}}
		{{~#when value.field.[0] '==' 'date' ~}}
		if(this.data.{{../../../slug}} && this.data.{{../../../slug}}.{{../../key}}) {
			this.data.{{../../../slug}}.{{../../key}} = _convertToControlDate(this.data.{{../../../slug}}.{{../../key}}, false, true);
		}
		
		{{/when~}}
		{{~#when value.field.[0] '==' 'time' ~}}
		if(this.data.{{../../../slug}} && this.data.{{../slug}}.{{../../key}}) {
			this.data.{{../../../slug}}.{{../../key}} = _convertToControlDate(this.data.{{../../../slug}}.{{../../key}}, true);
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
			
			// fire this event whenever the update page of {{name}} is available and fully loaded
			controller.trigger('{{name}}-update-ready');

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
		var id 		=  window.location.pathname.split('/')[3];
		
		
		controller.{{name}}.update(id, this.data.{{name}}, function(response) {
			if(!response.error) {		
				controller				
					//display message status
					.notify('Success', '{{singular}} successfully updated!', 'success')
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
	   }.bind(this));
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