require('./build/server/node_modules/edenjs/test/string.js');
require('./build/server/node_modules/edenjs/test/number.js');
require('./build/server/node_modules/edenjs/test/array.js');
require('./build/server/node_modules/edenjs/test/hash.js');
require('./build/server/node_modules/edenjs/test/i18n.js');
//require('./build/server/node_modules/edenjs/test/template.js');

var eden = require('./build/server/node_modules/edenjs/lib/index');

//PERMISSIONS
//console.log(eden('file', '/server/public/evejs2/web').getPermissions());

/*//MKDIR TEST
eden('folder', __dirname + '/test/foo/bar/zoo')
.mkdir(0777, function() {
	console.log('results', arguments);
});*/

/*//CREATE FILE TEST
eden('file', __dirname + '/test/bar/foo/zoo/test.txt').setContent('CHELLO !', function(error) {
	console.log('results', arguments);
});*/

/*//COPY FILE TEST
eden('file', __dirname + '/test/bar/foo/zoo/test.txt').copy(__dirname + '/test/foo/bar/zoo/tree/zone/boom.js', 0777, function() {
	console.log('results', arguments);
});*/

//GET FILES TEST
/*eden('folder', '/server/public/build').getFolders(null, true, function() {
	console.log('results', arguments);
});*/

//GET FOLDERS TEST
/*eden('folder', '/server/public/build/build/control').getFolders(null, true, function() {
	console.log('results', arguments);
});*/

//COPY FILES TEST
/*eden('folder', __dirname + '/test/bar').copy(__dirname + '/test/foo/bar/zoo/boom', 0777, function() {
	console.log('results', arguments);
});*/

//sequence test
/*var s1 = eden('sequence').then(function() { console.log('hi'); }).then(function() { console.log('hi2'); }).then(function() { console.log('hi3'); });

var s2 = eden('sequence').then(function() { console.log('hi4'); }).then(function() { console.log('hi5'); });

console.log(s1.stack.length, s2.stack.length);*/
/*
var something = function() {
	eden('argument').test(1, 'string');
}

var foo =  function() {
	something(1, 5, 'ok');
};

foo();*/