module.exports = function(settings, next) {
	var eden 		= settings.eden, 
		eve 		= settings.eve, 
		packages 	= settings.packages, 
		paths 		= settings.paths, 
		vendor 		= settings.vendor,
		error 		= false;

	eden('array').each(packages, function(i, package) {
		//determine the destination path
        var destination = eden('folder', paths.package + vendor.name + '/' + package);

        //does the destination package exist?
        if(destination.isFolder()) {
			error = true;
            eve.trigger('error', destination.path + ' already exists. If you want to build a new package, you must delete this package first.');
        }
	});

	//were there errors?
	if(error) {
		//stop
		return;
	}

	next(settings);
};