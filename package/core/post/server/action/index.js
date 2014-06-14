module.exports = function(controller, request, response) {
	//if one variable is set 
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
};