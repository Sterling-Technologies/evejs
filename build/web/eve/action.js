jQuery.eve.action = jQuery.eve.base.extend(function() {
	/* Require
	-------------------------------*/
	/* Constants
	-------------------------------*/
	/* Public.Properties
	-------------------------------*/
	/* Protected Properties
	-------------------------------*/
	this._title 	= '';
	this._header 	= '';
	this._subheader = '';
	this._crumbs 	= [];
	this._data 		= {};
	
	this._template 	= null;
	
	/* Private Properties
	-------------------------------*/
	/* Magic
	-------------------------------*/
	/* Public.Methods
	-------------------------------*/
	this.response = function() {
		controller()
			.sync()
			.scope(this)
			.then(this._setData)
			.then(this._output)
			.then(this._listen);
	};
	
	/* Protected Methods
	-------------------------------*/
	this._listen = this._setData = function(next) {
		next();
	};

	this._output = function(next) {
		//bulk load the templates
		require(['text!' + this._template], function(template) {
			//render the body
			var body = Handlebars.compile(template)(this._data);
			
			controller()
				.setTitle(this._title)
				.setHeader(this._header)
				.setSubheader(this._subheader)
				.setCrumbs(this._crumbs)
				.setBody(body);
			
			next();
		}.bind(this));
	};
	
	/* Private Methods
	-------------------------------*/
});