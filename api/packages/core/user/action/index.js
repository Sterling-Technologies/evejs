module.exports = function(controller, request, response) {
	var c = function() {
		this.render.call();
	}, public = c.prototype;
	/* Loader
	-------------------------------*/
	public.__load = c.load = function() {
		(!this.__instance ? this.__instance = new c() : this.__instance);

		return this.__instance;
	};
	/* Construct
	-------------------------------*/
	public.render = function() {
		if(request.variables[0]) {
			//is it an update ?
			if(request.method.toUpperCase() == 'PUT') {
				require('./update')(controller, request, response);
				return;
			}
			
			//is it an removal ?
			if(request.method.toUpperCase() == 'DELETE') {
				require('./remove')(controller, request, response);
				return;
			}
			
			//it must be a detail
			require('./detail')(controller, request, response);
			return;
		}
		
		//is it a create ?
		if(request.method.toUpperCase() == 'POST') {
			require('./create')(controller, request, response);
			return;
		}
		
		//it must be a listing
		require('./list')(controller, request, response);
	}
	/* Private Methods
	-------------------------------*/
	/* Adaptor
	-------------------------------*/
	return c.load(); 
}