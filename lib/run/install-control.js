module.exports = function(eve, local, args) {
	var eden 	= require('edenjs');
	var exec 	= require('child_process').exec;
	
	var deploy = {};
	
	eden('sequence')
	//get paths
	.then(require(__dirname + '/../install/control/get-paths').bind(null, eden, local, deploy))

	// 1. Create Folder Structure in [ROOT] -X
	.then(require(__dirname + '/../install/control/create-folder').bind(null, eden, eve, local, deploy))
	
	// 2. Copy [DEV]/build/control folder to [CONTROL]
	.then(require(__dirname + '/../install/control/copy-control-folder').bind(null, eden, eve, local, deploy))
	
	// 3. Copy [DEV]/config/control folder to [CONTROL]/config
	.then(require(__dirname + '/../install/control/copy-config-folder').bind(null, eden, eve, local, deploy))
	
	// 4. Copy config to caller
	.then(require(__dirname + '/../install/control/copy-config-file').bind(null, eden, eve, local, deploy))
	
	// 5. Get vendor folders
	.then(require(__dirname + '/../install/control/get-vendor-folders').bind(null, eden, eve))
	
	// 6. Deploy vendor folders
	.then(require(__dirname + '/../install/control/copy-vendor-folders').bind(null, eden, eve, local, deploy))
	
	// 7. installation complete
	.then(require(__dirname + '/../install/control/installation-complete').bind(null, eve, local, deploy));
};