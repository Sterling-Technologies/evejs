define(function() {
   	return jQuery.eve.base.extend(function() {
		/* Require
		-------------------------------*/
		var $ = jQuery;
		
		/* Constants
		-------------------------------*/
		/* Public.Properties
		-------------------------------*/
		/* Protected.Properties
		-------------------------------*/
		this._data 		= {};
       	this._template 	= '/component/pagination.html';
    	
		/* Private Properties
		-------------------------------*/
		/* Public Methods
		-------------------------------*/
        this.response = function(request) {
			//if there is one or less pages
			if(this._data.pages < 2) {
				//render nothing
				this.Controller().trigger('block-response', request, '');
				return;
			}
			
			//store form templates path to array
			var template = this.Controller().path('block/template') + this._template;
			
			//freeze the data for async call
			this.___freeze();
			
			//require form templates
			//assign it to main form
			require(['text!' + template], function(template) {
				this._data.items = [];
				for(var i = 0; i < this._data.pages; i++) {
					this._data.query.page = i + 1;
					this._data.items.push({
						page	: i + 1,
						active	: this._data.current == (i + 1), 
						query	: this.Hash().toQuery(this._data.query) });
				}
				
				//trigger
				var response = Handlebars.compile(template)(this._data);
				this.Controller().trigger('block-response', request, response);
				
				//unfreeze data
				this.___unfreeze();
			}.bind(this));
			
			return this;
		};
		
		this.setType = function(type) {
			this._data.type = type;
			return this;
		};
		
		this.setData = function(total, range, attributes) {
			//get current query
			var query 		= {},
				current		= 1,
				queryString = window.location.href.split('?')[1];
			
			//if we have a query string
			if(queryString && queryString.length) {
				//make it into an object
				query = this.String().queryToHash(queryString);
				//remember the current page
				current = query.page || 1;
			}
			
			//how many pages?
			var pages = Math.ceil(total / range);
			
			this._data.pages 		= pages;
			this._data.current 		= current;
			this._data.query 		= query;
			this._data.attributes 	= attributes || '';
			
			return this;
		};
		
		this.setInnerTemplate = function(template) {
			//make template an empty function
			//if not already defined
			template = template || $.noop;
			
			//call the template (Handlebars)
			//make sure attributes is a string otherwise
			this._data.innerTemplate = template() || '';
			
			return this;
		};
	
		/* Protected Methods
		-------------------------------*/
		/* Private Methods
		-------------------------------*/
	});
});