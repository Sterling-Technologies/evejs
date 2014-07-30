module.exports = function(eden, eve, local, deploy, next) {
	eve.trigger('install-web-step-1', eve, local, deploy.path);

	eden('folder', deploy.path)
	.mkdir(0777, function() {
		eve.trigger('install-web-step-2', eve, local, deploy.path);
		next();
	});
};