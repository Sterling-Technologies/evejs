/**
 * Returns the requested data back
 * but better organized format
 *
 * @param object
 * @return object
 */
var _getRequestData = function(request) {
	var queries = request.query.query || {},
		ranges 	= request.query.range || 50,
		starts 	= request.query.start || 0,
		orders 	= request.query.order || {},
		counts	= request.query.count || 0;
	
	//make queries into an array
	if(!(queries instanceof Array)) {
		queries = [queries];
	}
	
	//make starts into an array
	if(!(starts instanceof Array)) {
		starts = [starts];
	}
	
	//make ranges into an array
	if(!(ranges instanceof Array)) {
		ranges = [ranges];
	}
	
	//make orders into an array
	if(!(orders instanceof Array)) {
		orders = [orders];
	}
	
	//make counts into an array
	if(!(counts instanceof Array)) {
		counts = [counts];
	}
	
	var max = Math.max(
		queries.length, 
		starts.length, 
		ranges.length, 
		orders.length,
		counts.length);
	
	return {
		queries	: queries, 
		starts	: starts, 
		ranges	: ranges, 
		orders	: orders, 
		counts	: counts,
		max		: max };
};

/**
 * Gets results for each item
 *
 * @param function
 * @param object controller
 * @param array
 * @param object
 * @param number
 * @param number
 * @param object
 * @param number
 * @return object
 */
var _getResults = function(next, controller, 
results, query, start, range, order, count) {
	//fix query
	query.active = query.active != 0;
	
	//if null value, just test if it exists
	for(var key in query) {
		if(query[key] !== null) {
			continue;
		}
		
		query[key] = { $exists: true };
	}
	
	var store = controller.user().store();
	
	if(count) {
		store.count(query, function(error, data) {
			//if there are errors
			if(error) {
				//setup an error response
				response.message = JSON.stringify({ 
					error: true, 
					message: error.message });
				
				//trigger that a response has been made
				controller.trigger('user-action-response', request, response);
				return;
			}
			
			//no error, add to results
			results.push({ 
				error: false, 
				results: data });
			
			next();
		});
		
		return;
	} 
	
	//set up the store for results
	store = store.find(query)
		.skip(start)
		.limit(range);
	
	for(key in order) {
		store.sort(key, order[key] != -1 ? 1: -1);
	}
	
	//query for results
	store.lean().exec(function(error, data) {
		//if there are errors
		if(error) {
			//no error, add to results
			results.push({ 
				error: true, 
				message: error.message });
			
			return;
		}
		
		//no error, add to results
		results.push({ 
				error: false, 
				results: data });
		
		next();
	});
};
/**
 * Main action method
 *
 * @param object
 * @param object
 * @param object
 * @return void
 */
module.exports = function(controller, request, response) {
	//there will be a group of results
	var results = [], 
		//gather all the request data
		requestData = _getRequestData(request),
		//load sequence
		sequence = controller.eden.load('sequence');
	
	for(var i = 0; i < requestData.max; i++) {
		sequence.then(controller.eden.alter(
			_getResults, this, 
			controller, results,
			requestData.queries[i] || {}, 
			requestData.starts[i] || 0, 
			requestData.ranges[i] || 50, 
			requestData.orders[i] || {}, 
			requestData.counts[i] == 1));
	}
	
	sequence.then(function(next) {
		if(response.message) {
			next();
			return;
		}
		
		//declare a wrapper
		response.message = JSON.stringify({ batch: results });
		
		if(results.length === 1) {
			//prepare the package
			response.message = JSON.stringify(results[0]);
		}
		
		//trigger that a response has been made
		controller.trigger('user-action-response', request, response);
	});
};