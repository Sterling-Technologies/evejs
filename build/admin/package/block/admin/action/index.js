define(function() {
   return jQuery.eve.base.extend(function() {
		/* Require
		-------------------------------*/
		var $ = jQuery;
		
		/* Public Properties
		-------------------------------*/
		/* Protected Properties
		-------------------------------*/
		this._title 	= 'Blocks';
		this._header 	= 'Blocks';
		this._subheader = 'Template One';
		this._crumbs 	= [{ icon: 'desktop', label: 'Blocks' }];
		this._data 		= {};
		
		this._start		= 0;
		this._page 		= 1;
		this._range 	= 25;
		
		this._template 	= '/index.html';
		
		/* Private Properties
		-------------------------------*/
		/* Public Methods
		-------------------------------*/
		this.response = function(request) {
			this._data.list = [
				{ value: 1, label: 'Label 1' },
				{ value: 2, label: 'Label 2' },
				{ value: 3, label: 'Label 3' },
				{ value: 4, label: 'Label 4' } ];
				
			this._data.error = { name: 'Name cannot be empty.' };
			
			this._data.complete = { 
				local: [
					'Lorem Ipsum', 
					'Ipsum Dolor',
					'Dolor Levity',
					'Levity Dasma',
					'Dasma Dogity',
					'Dogity Lorem',
					'Lord Of the Rings']
			};
			
			//bulk load the templates
			var template = this.Controller().path('block/template') + this._template;
			
			//freeze the data for async call
			this.___freeze();
			
			//now get the template
			require(['text!' + template], function(template) {
				//render the body
				var body = Handlebars.compile(template)(this._data);
				
				this.Controller()
					.setTitle(this._title)
					.setHeader(this._header)
					.setSubheader(this._subheader)
					.setCrumbs(this._crumbs)
					.setBody(body);
					
				//unfreeze data
				this.___unfreeze();
			}.bind(this));
		};
		
		/* Protected Methods
		-------------------------------*/
		/* Private Methods
		-------------------------------*/
	}).singleton();
});