module.exports = function(settings, content, data) {
	var eden = settings.eden, searchable = [];
	
	//for each fields
	//	 or.push([
	//		{ field1	: new RegExp(keyword, 'ig') },
	//		{ field2	: new RegExp(keyword, 'ig') },
	//		{ field3	: new RegExp(keyword, 'ig') } ]);
	eden('hash').each(data.fields, function(name, field) {
		if(!field.search) {
			return;
		}
		
		var term = {};
		term[name] = '{VALUE}';
		searchable.push(term);
	});
	
	searchable = JSON.stringify([[[searchable]]], null, 4);
	
	searchable = searchable.replace(/"{VALUE}"/g, 'new RegExp(keyword, \'ig\')');
	
	searchable = searchable.substr(30, searchable.length - 48);
	
	searchable = 'or.push(' + searchable + ');'
	
	return eden('string').replace(content, /{SERVER_SEARCHABLE}/g	, searchable);
};