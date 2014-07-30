module.exports = function(eden, packages, files, next) {
	//parse through files
	eden('array').each(files, function(i, file) {
		//if this is not a js file
		if(file.getExtension() != 'js') {
			//skip it
			return;
		}

		//store the package
		packages.push(file.getBase());
	});

	next();
};