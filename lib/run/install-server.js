module.exports = function(eve, local, config) {
	var eden 	= require('edenjs');
	var wizard 	= require('prompt');
	var exec 	= require('child_process').exec;

	var deploy = {};

	eden('sequence')
	//get paths
	.then(require(__dirname + '/../install/server/get-paths').bind(null, eden, wizard, eve, local, deploy))

	// 1. Create Folder Structure in [ROOT] -X
	.then(require(__dirname + '/../install/server/create-folder').bind(null, eden, eve, local, deploy))

	// 2. Copy [DEV]/build/server folder to [SERVER]
	.then(require(__dirname + '/../install/server/copy-server-folder').bind(null, eden, eve, local, deploy))

	// 3. Copy [DEV]/config/server folder to [SERVER]/config
	.then(require(__dirname + '/../install/server/copy-config-folder').bind(null, eden, eve, local, deploy))

	// 4. Copy config to local
	.then(require(__dirname + '/../install/server/copy-config-file').bind(null, eden, eve, local, deploy))

	// 5. Get vendor folders
	.then(require(__dirname + '/../install/server/get-vendor-folders').bind(null, eden, eve))

	// 6. Deploy vendor folders
	.then(require(__dirname + '/../install/server/copy-vendor-folders').bind(null, eden, eve, local, deploy))

	// 7. Install node modules
	.then(require(__dirname + '/../install/server/install-node-modules').bind(null, eve, local, deploy, exec))

	// 8. Complete Installation
	.then(require(__dirname + '/../install/server/installation-complete').bind(null, eve, local, deploy));
};