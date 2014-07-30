module.exports = function(eve, local, deploy) {
	eve.trigger('install-server-complete', eve, local, deploy.path);
};