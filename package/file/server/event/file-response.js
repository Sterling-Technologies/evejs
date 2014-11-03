module.exports = function(request, response) {
	//if it is a batch process
	if(typeof response.batch === 'object' && response.batch !== null) {
		//All results will be push to the array results
		response.batch.results.push(JSON.parse(response.message));
		
		//If results is equal to request query
		if(response.batch.results.length == JSON.parse(response.batch.request.message).length) {
			//All batch results will be JSON stringify
			response.message = JSON.stringify({ batch: response.batch.results });
			
			//get back the real request
			request = response.batch.request;
			
			//set the batch to false
			response.batch = false;
			
			//Trigger to the server response
			this.trigger('server-response', request, response);
			return;
		}
		
		response.batch.next();
		return;
	}
	
	//trigger that a response has been made
	this.trigger('server-response', request, response);
};