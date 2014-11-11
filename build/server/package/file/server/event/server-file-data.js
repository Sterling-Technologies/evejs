module.exports = function(meta, data) {
	//save file given the id
	meta.stream.write(data); 
};