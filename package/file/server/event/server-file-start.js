module.exports = function(meta) {
	//just assign an id
	 meta.id = this.String().uuid();
	
	//where should it be stored?
	meta.path = this.path('upload') + '/' + meta.id;
	
	//setup a stream 
	meta.stream = this.File(meta.path).getWriteStream();
};