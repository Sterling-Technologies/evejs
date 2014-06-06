define(function() {
	var c = function() {}, public = c.prototype;
	
	/* Public Properties 
	-------------------------------*/
	public.data 	= {};

	/* Private Properties
	-------------------------------*/
	var $ 		= jQuery;
	var _api 	= 'http://api.eve.dev:8082/post/remove/';
	
	/* Loader
	-------------------------------*/
	public.__load = c.load = function() {
		return new c();
	};

	/* Construct
    -------------------------------*/
    /* Public Methods
    -------------------------------*/
	public.render = function() { 
        $.sequence().setScope(this)
        .then(this.removeData)
        .then(this.output);
        
        return this;
    };

    /** 
     * Remove data
     *
     * @param function callback
     * return this
     */
    public.removeData = function(callback) {
    	var _id = _api + window.location.pathname.split('/')[3];
    	
    	$.getJSON(_id, function(response) {
    		//if error
    		if(response.error) {
    			return;
    		}
    		callback();
    	});
    	return this;
    };

    /** 
     * Output
     *
     * @param function callback
     * return this
     */
    public.output = function(callback) {

    	callback();
    	return this;
    };

	/* Adaptor
	-------------------------------*/
	return c.load(); 

});