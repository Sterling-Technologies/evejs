module.exports = function(files, request, response) {
	for(var results = [], i = 0; i < files.length; i++) {
		results.push(files[i].file_id);
	}
	
	//set up a success response
	response.message = JSON.stringify({ error: false, results: results });
	//trigger that a response has been made
	this.trigger('file-response', request, response);
};