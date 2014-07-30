module.exports = function(eden, eve, next) {
	eden('folder', eve.root + '/package').getFolders(null, false, next);
};