define(function() {
   return jQuery.eve.base.extend(function() {
		/* Require
		-------------------------------*/
		var $ = jQuery; 
		
		/* Constants
		-------------------------------*/
		/* Public.Properties
		-------------------------------*/
		/* Protected Properties
		-------------------------------*/
		this._data			= {};
		this._title			= 'Create {{singular}}';
		this._header		= 'Create {{singular}}';
		this._subheader		= '';
		
		this._crumbs = [{ 
			path: '/{{name}}',
			icon: '{{icon}}', 
			label: '{{plural}}' 
		}, {  label: 'Create {{singular}}' }];
		
		this._template = '/form.html';
		
		/* Private Properties
		-------------------------------*/
		/* Magic
		-------------------------------*/
		/* Public.Methods
		-------------------------------*/
		this.response = function(request) {
			//variable list
			this._data.mode 	= 'create';
			this._data.url 		= request.url;
			this._data.{{name}}	= request.data;
			this._data.errors 	= {};
			
			//if there are field errors
			if(request.errors instanceof Array && request.errors.length) {	
				//parse out those errors for the template
				for(var i = 0; i < request.errors.length; i++) {
					this._data.errors[request.errors[i].name] = request.errors[i].message;
				}
				
				//no need for these anymore
				delete request.error;
				delete request.errors;
				
				//output the errors
				this._output(request);
				return this;
			}
			
			//if there is data from the request and there are no errors
			if(Object.keys(this._data.{{name}}).length && !request.error) {
				//start the create process
				this.Controller().trigger('{{name}}-create', this._data.{{name}}, request, this);
				return this;
			}
			
			//if no data
			if(!Object.keys(this._data.{{name}}).length) {
				//set default data
				//NOTE: BULK GENERATE
				{{~#loop fields ~}} 
					{{~#if value.default ~}} 
						{{~#when value.default '==' 'now()'}}
				this._data.{{../../../name}}.{{../../key}} = Date.now();
						{{~/when~}} 
						{{~#when value.default '!=' 'now()'}}
				this._data.{{../../../name}}.{{../../key}} = {{{../../value.default}}};
						{{~/when~}} 
					{{~/if~}} 
				{{~/loop}}
			}
			
			//if it was an error
			delete request.error;
			
			//output the form
			this._output(request);
			
			return this;
		};
		
		/* Protected Methods
		-------------------------------*/
		this._output = function(request) {
			//ENUMS
			//NOTE: BULK GENERATE
			{{#loop fields ~}} 
				{{~#if value.options ~}} 
				{{~#when value.type '!=' 'file'~}} 
			this._data.{{../key}}_list = [
				{{#loop ../value.options ~}}
				{ label: '{{value.label}}', value: '{{value.value}}' }
				{{~#unless last}},
				{{/unless~}}
				{{/loop~}}
			];
				{{~/when~}}
				{{~/if~}} 
			{{~/loop}}
			
			//Convert to field date format
			//NOTE: BULK GENERATE
			{{#loop fields ~}}
			{{~#if value.field ~}}
			{{~#when value.field.[0] '==' 'datetime' ~}}
			if(this._data.{{../../../name}} && this._data.{{../../../name}}.{{../../key}}) {
				this._data.{{../../../name}}.{{../../key}} = this.Time().toDate(this._data.{{../../../name}}.{{../../key}}, 'm/d/Y g:i A');
			}
			
			{{/when~}}
			{{~#when value.field.[0] '==' 'date' ~}}
			if(this._data.{{../../../name}} && this._data.{{../../../name}}.{{../../key}}) {
				this._data.{{../../../name}}.{{../../key}} = this.Time().toDate(this._data.{{../../../name}}.{{../../key}}, 'm/d/Y');
			}
			
			{{/when~}}
			{{~#when value.field.[0] '==' 'time' ~}}
			if(this._data.{{../../../name}} && this._data.{{../name}}.{{../../key}}) {
				this._data.{{../../../name}}.{{../../key}} = this.Time().toDate(this._data.{{../../../name}}.{{../../key}}, 'g:i A');
			}
			
			{{/when~}}
			{{~/if~}}
			{{~/loop}}
			
			var template = this.{{name}}().path('template') + this._template;
			
			//freeze the data
			this.___freeze();
			
			//require form templates
			//assign it to main form
			require(['text!' + template], function(template) {
				//render the body
				var body = Handlebars.compile(template)(this._data);
				
				this.Controller()
					.setTitle(this._title)
					.setHeader(this._header)
					.setSubheader(this._subheader)
					.setCrumbs(this._crumbs)
					.setBody(body)
					.trigger('{{name}}-response', request, this);            
			
				//unfreeze data
				this.___unfreeze();
			}.bind(this));
		};
		
		/* Private Methods
		-------------------------------*/
	}).singleton();
});