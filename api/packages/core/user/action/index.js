module.exports = function(controller, request, response) {
	var c = function() {}, public = c.prototype,
	/* Loader
	-------------------------------*/
	public.__load = c.load = function() {
		public.render();
		return new c();
	};	
	/* Construct
	-------------------------------*/
	/* Public Methods
	-------------------------------*/
	public.render = function() {
		if(request.variables[0]) {
			//is it an update ?
			if(request.method.toUpperCase() == 'PUT') {
				require('./update')(controller, request, response);
				return this;
			}
			
			//is it an removal ?
			if(request.method.toUpperCase() == 'DELETE') {
				require('./remove')(controller, request, response);
				return this;
			}
			
			//it must be a detail
			require('./detail')(controller, request, response);
			return this;
		}
		
		//is it a create ?
		if(request.method.toUpperCase() == 'POST') {
			require('./create')(controller, request, response);
			return this;
		}
		
		//it must be a listing
		require('./list')(controller, request, response);
		return this;
	}
	/* Private Methods
	-------------------------------*/
	/* Adaptor
	-------------------------------*/
	return c.load(); 
}