module.exports = function(eve, local, args) {
	var eden 	= require('edenjs');
	var exec 	= require('child_process').exec;

	var deploy = {};

	eden('sequence')
	//get paths
	.then(require(__dirname + '/../install/web/get-paths').bind(null, eden, eve, local, deploy))

	// 1. Create Folder Structure in [ROOT] -X
	.then(require(__dirname + '/../install/web/create-folder').bind(null, eden, eve, local, deploy))

	// 2. Copy [DEV]/build/web folder to [CONTROL]
	.then(require(__dirname + '/../install/web/copy-web-folder').bind(null, eden, eve, local, deploy))

	// 3. Copy [DEV]/config/web folder to [CONTROL]/config
	.then(require(__dirname + '/../install/web/copy-config-folder').bind(null, eden, eve, local, deploy))

	// 4. Copy config to caller
	.then(require(__dirname + '/../install/web/copy-config-file').bind(null, eden, eve, local, deploy))

	// 5. Get vendor folders
	.then(require(__dirname + '/../install/web/get-vendor-folders').bind(null, eden, eve))

	// 6. Deploy vendor folders
	.then(require(__dirname + '/../install/web/copy-vendor-folders').bind(null, eden, eve, local, deploy))

	// 7. Installation Complete
	.then(require(__dirname + '/../install/web/installation-complete').bind(null, eve, local, deploy));
};