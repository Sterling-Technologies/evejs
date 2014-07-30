module.exports = function(eden, local, next) {
	eden('file', local + '/build.json').getContent(next);
};