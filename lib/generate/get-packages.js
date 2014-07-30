module.exports = function(eden, eve, packages, vendor, parameter, paths, next) {
	vendor.name = parameter.split('/')[0];

	if(parameter.split('/').length == 2) {
		 packages.push(parameter.split('/')[1]);
	}

	if(packages.length) {
		next([]);
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
    eden('folder', paths.schema + vendor.name).getFiles(null, false, next);
};