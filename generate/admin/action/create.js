define(function() {
   return jQuery.eve.action.extend(function() {
		/* Require
		-------------------------------*/
		var $ = jQuery; 
		
		/* Constants
		-------------------------------*/
		/* Public.Properties
		-------------------------------*/
		/* Protected Properties
		-------------------------------*/
		this._title        = 'Create {{singular}}';
		this._header       = 'Create {{singular}}';
		this._subheader    = '';
		
		this._crumbs = [{ 
			path: '/{{name}}',
			icon: '{{icon}}', 
			label: '{{plural}}' 
		}, {  label: 'Create {{singular}}' }];
		
		this._template = controller().path('{{name}}/template') + '/form.html';
		
		/* Private Properties
		-------------------------------*/
		/* Magic
		-------------------------------*/
		/* Public.Methods
		-------------------------------*/
		/* Protected Methods
		-------------------------------*/
		this._setData = function(next) {
			this._data.mode 	= 'create';
			this._data.url 		= window.location.pathname;
			this._data.{{name}}	= {};
			
			//NOTE: BULK GENERATE
			{{~#loop fields ~}} 
				{{~#if value.default ~}} 
					{{~#when value.default '==' 'now()'}}
			this._data.{{../../../name}}.{{../../key}} = Date.now();
					{{~/when~}} 
					{{~#when value.default '!=' 'now()'}}
			this._data.{{../../../name}}.{{../../key}} = {{../../value.default}};
					{{~/when~}} 
				{{~/if~}} 
			{{~/loop}}
			
			var data = this.getState().data;
			
			if(Object.keys(data).length) {
				//query to hash
				this._data.{{name}} = data;
				
				if(!this._valid()) {			
					//display message status
					controller().notify('Error', 'There was an error in the form.', 'error');
					
					next();
					
					return;
				}
				
				//we are good to send this up
				this._process(next);
				
				return;
			}
			
			next();
		};
		
		this._output = function(next) {
			//store form templates path to array
			var templates = ['text!' + this.path('{{name}}/template') +  '/form.html'];
			
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
			
			//require form templates
			//assign it to main form
			require(templates, function(form) {
				//render the body
				var body = Handlebars.compile(form)(this._data);
				
				controller()
					.setTitle(this._title)
					.setHeader(this._header)
					.setSubheader(this._subheader)
					.setCrumbs(this._crumbs)
					.setBody(body);            
					
				next();
			}.bind(this));
		};
		
		this._valid = function() {
			//VALIDATION
			this._data.errors = this.{{name}}().getErrors(this._data.{{name}});
			
			//if we have no errors
			return JSON.stringify(this._data.errors) === '{}';
		};
		
		this._process = function(next) {
			var data = this._data;
			
			//Convert to server date format
			//NOTE: BULK GENERATE
			{{#loop fields ~}}
			{{~#if value.field ~}}
			{{~#when value.field.[0] '==' 'datetime' ~}}
			if(data.{{../../../name}} && data.{{../../../name}}.{{../../key}}) {
				data.{{../../../name}}.{{../../key}} = this.Time().toDate(data.{{../../../name}}.{{../../key}}, 'Y-m-d H:i:s');
			}
			
			{{/when~}}
			{{~#when value.field.[0] '==' 'date' ~}}
			if(data.{{../../../name}} && data.{{../../../name}}.{{../../key}}) {
				data.{{../../../name}}.{{../../key}} = this.Time().toDate(data.{{../../../name}}.{{../../key}}, 'Y-m-d');
			}
			
			{{/when~}}
			{{~#when value.field.[0] '==' 'time' ~}}
			if(data.{{../../../name}} && data.{{../../../name}}.{{../../key}}) {
				data.{{../../../name}}.{{../../key}} = this.Time().toDate(data.{{../../../name}}.{{../../key}}, 'H:i:s');
			}
			
			{{/when~}}
			{{~/if~}}
			{{~/loop}}
			
			//send to server
			this.{{name}}().create(this._data.{{name}}, function(error, response) {
				//if there is an error
				if(error) {
					//Add to gritter
					controller().notify('Form Error', error, 'error');
					next();
					return;
				}
				
				if(!response.error) {		
					controller()			
						//display message status
						.notify('Success', 'Item successfully created!', 'success')
						//go to listing
						.redirect('/{{name}}');
					
					//no need to next since we are redirecting out
					return;
				}
				
				if(response.validation && response.validation instanceof Array) {
					data.errors = {};
					for(var j, i = 0; i < response.validation.length; i++) {
						for(j in response.validation[i]) {
							if(response.validation[i].hasOwnProperty(j)) {
								data.errors[j] = response.validation[i][j];
							}
						}	
					}
				}
				
				//display message status
				controller().notify('Error', 'There was an error in the form.', 'error');
				
				next();
			})
			
			//track progress
			.once('progress', function(e, percent) {
				controller().notify('Submitting Form', percent + '%', 'info');
			})
			
			//now send
			.send();
		};
		
		/* Private Methods
		-------------------------------*/
	});
});