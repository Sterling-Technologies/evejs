module.exports = function(eve, local, deploy) {
	eve.trigger('install-web-complete', eve, local, deploy.path);
};