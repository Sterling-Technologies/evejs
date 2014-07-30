module.exports = function(eden, eve, local, deploy, vendors, next) {
	//make a sub sequence
	var sequence2 = eden('sequence');

	eden('array').each(vendors, function(i, vendor) {
		// 5a. Create [VENDOR] in [CONTROL]/application/package
		sequence2.then(function(next2) {
			var path = deploy.path + '/application/package/' + vendor.getName();

			eden('folder', path).mkdir(0777, function() {
				next2();
			});	
		}).then(function(next2) {
			var path = eve.root + '/package/' + vendor.getName();

			eden('folder', path).getFolders(null, false, next2);
		// 5b. Loop through each package folder [ROOT]/package/[VENDOR]/[PACKAGE]
		}).then(function(packages, next2) {
			//make a sub sequence
			var sequence3 = eden('sequence');

			eden('array').each(packages, function(i, package) {
				// 5b1. Copy [ROOT]/package/[VENDOR]/[PACKAGE]/web/ to [WEB]/application/package/[VENDOR]/[PACKAGE]
				sequence3.then(function(next3) {
					var source = package.path + '/web';
					var destination = deploy.path 
						+ '/application/package/' 
						+ vendor.getName() + '/' 
						+ package.getName();

					eden('folder', source).copy(destination, function() {
						next3();
					});
				// 5b2. Copy [ROOT]/package/[VENDOR]/[PACKAGE]/web/ to caller
				}).then(function(next3) {
					var source = package.path + '/web';
					var destination = local 
						+ '/package/' 
						+ vendor.getName() + '/' 
						+ package.getName() 
						+ '/web';

					eden('folder', source).copy(destination, function() {
						next3();
					});
				});
			});

			//we are done with sequence 3
			sequence3.then(function() {
				//call next 2
				next2();
			});
		});
	});

	//we are done with sequence 2
	sequence2.then(function() {
		//call next 
		next();
	});
};