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
		this._title        = 'Updating Item';
		this._header       = 'Updating Item';
		this._subheader    = '';
		
		this._crumbs = [{ 
			path: '/sink',
			icon: 'facebook', 
			label: 'Items' 
		}, {  label: 'Updating Item' }];
		
		this._data     = {};
		
		this._template = controller().path('sink/template') + '/form.html';
		
		/* Private Properties
		-------------------------------*/
		/* Magic
		-------------------------------*/
		/* Public.Methods
		-------------------------------*/
		/* Protected Methods
		-------------------------------*/
		this._setData = function(next) {
			this._data.mode 	= 'update';
			this._data.url 		= window.location.pathname;
			this._data.sink		= {};
			
			var data = this.getState().data;
			
			if(Object.keys(data).length) {
				//query to hash
				this._data.sink = data;
				
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
			
			//if no data sink set
			if(JSON.stringify(this._data.sink) === '{}') {
				//get it from the server
				//get sink id
				var id =  window.location.pathname.split('/')[3];
				
				this.sink().getDetail(id, function(response) {
					this._data.sink = response.results;
					next();
				}.bind(this));
				
				return;
			}
			
			next();
		};
		
		this._output = function(next) {
			//store form templates path to array
			var templates = ['text!' + controller().path('sink/template') +  '/form.html'];
			
			//ENUMS
			//NOTE: BULK GENERATE
			
			
			//CONTROL CONVERT
			//NOTE: BULK GENERATE
				
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
			this._data.errors = this.sink().getErrors(this._data.sink);
			
			//if we have no errors
			return JSON.stringify(this._data.errors) === '{}';
		};
		
		this._process = function(next) {
			var data = this._data, id = window.location.pathname.split('/')[3];
			
			//send to server
			this.sink().update(id, this._data.sink, function(error, response) {
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
						.notify('Success', 'Item successfully updated!', 'success')
						//go to listing
						.redirect('/sink');
					
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