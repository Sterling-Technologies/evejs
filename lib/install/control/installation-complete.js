module.exports = function(eve, local, deploy) {
	eve.trigger('install-control-complete', eve, local, deploy.path);
};