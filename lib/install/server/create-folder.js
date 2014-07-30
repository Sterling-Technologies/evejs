module.exports = function(eden, eve, local, deploy, next) {
	eve.trigger('install-server-step-1', eve, local, deploy.path);

	eden('folder', deploy.path)
	.mkdir(0777, function() {
		eve.trigger('install-server-step-2', eve, local, deploy.path);
		next();
	});
};