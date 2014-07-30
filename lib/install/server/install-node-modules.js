module.exports = function(eve, local, deploy, exec, next) {
	eve.trigger('install-server-step-6', eve, local, deploy.path);
	exec('cd ' + deploy.path + ' && npm install', next);
};