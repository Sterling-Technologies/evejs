module.exports = function(settings, next) {
	var eden		= settings.eden, 
		eve			= settings.eve, 
		packages	= settings.packages, 
		vendor		= settings.vendor, 
		parameter	= settings.parameter, 
		paths		= settings.paths;
		
	vendor.name = parameter.split('/')[0];

	if(parameter.split('/').length == 2) {
		 packages.push(parameter.split('/')[1]);
	}

	if(packages.length) {
		next(settings);
		return;
	}

	//there is no packages
	//get the list of packages by folder
	//is this a valid folder ? 
    if(!eden('folder', paths.schema + vendor.name).isFolder()) {
        eve.trigger('error', paths.schema + vendor.name + ' does not exist.');
        return;
    }

	//query the vendor folder for the list of packages
    eden('folder', paths.schema + vendor.name)
	.getFiles(null, false, function(files) {
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
	
		next(settings);
	});
};