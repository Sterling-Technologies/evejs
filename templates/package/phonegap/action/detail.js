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
		this._data     		= {};
		this._title       	= '{{singular}}';
		
		this._template = '/detail.html';
		
		/* Private Properties
		-------------------------------*/
		/* Magic
		-------------------------------*/
		/* Public.Methods
		-------------------------------*/
		this.response = function(request) {
			//find out the id
			//if no ID
			if(!request.variables[0]) {
				//setup an error
				this.Controller().notify('Error', 'No ID set', 'error');
				window.history.back();
				return this;
			}
			
			var id 	= request.variables[0];
			
			//freeze the data
			this.___freeze();
			
			//get it from the server
			this.Controller().package('{{name}}').getDetail(id, function(response) {
				//now set the data
				this._data.detail = response.results;
				//now output it
				this._output(request);
			}.bind(this));
			
			return this;
		};
		
		/* Protected Methods
		-------------------------------*/
		this._output = function(request) {
			//Convert to field date format
			//NOTE: BULK GENERATE
			{{#loop fields ~}}
			{{~#if value.field ~}}
			{{~#when value.field.[0] '==' 'datetime' ~}}
			if(this._data.setting.{{../../key}}) {
				this._data.setting.{{../../key}} = this.Time().toDate(this._data.setting.{{../../key}}, 'm-d-Y g:i A');
			}
			
			{{/when~}}
			{{~#when value.field.[0] '==' 'date' ~}}
			if(this._data.setting.{{../../key}}) {
				this._data.setting.{{../../key}} = this.Time().toDate(this._data.setting.{{../../key}}, 'm-d-Y');
			}
			
			{{/when~}}
			{{~#when value.field.[0] '==' 'time' ~}}
			if(this._data.setting.{{../../key}}) {
				this._data.setting.{{../../key}} = this.Time().toDate(this._data.setting.{{../../key}}, 'g:i A');
			}
			
			{{/when~}}
			{{~/if~}}
			{{~/loop}}
			
			var template = this.Controller().package('{{name}}').path('template') + this._template;
			
			//require form templates
			//assign it to main form
			require(['text!' + template], function(template) {
				//render the body
				var body = Handlebars.compile(template)(this._data);
				
				this.Controller()
					.setTitle(this._title)
					.setBody(body)
					.trigger('{{name}}-update-output', request, this);            
			
				//unfreeze data
				this.___unfreeze();
			}.bind(this));
		};
		
		/* Private Methods
		-------------------------------*/
	});
});