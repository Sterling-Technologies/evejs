define(function() {
	var c = function() {}, public = c.prototype;
	
	/* Public Properties 
	-------------------------------*/
	public.data 	= {};

	/* Private Properties
	-------------------------------*/
	var $ 		= jQuery;
	var _api 	= 'http://api.eve.dev:8082/user';
	
	/* Loader
	-------------------------------*/
	public.__load = c.load = function() {
		return new c();
	};




	/* Adaptor
	-------------------------------*/
	return c.load(); 

});