Handlebars.registerHelper('when', function(value1, operator, value2, options) {
	var valid = false;
	
	switch (true) {
		case operator == 'eq' 	&& value1 == value2:
		case operator == '==' 	&& value1 == value2:
		case operator == 'req' 	&& value1 === value2:
		case operator == '===' 	&& value1 === value2:
		case operator == 'neq' 	&& value1 != value2:	
		case operator == '!=' 	&& value1 != value2:
		case operator == 'rneq' && value1 !== value2:
		case operator == '!==' 	&& value1 !== value2:
		case operator == 'lt' 	&& value1 < value2:
		case operator == '<' 	&& value1 < value2:
		case operator == 'lte' 	&& value1 <= value2:
		case operator == '<=' 	&& value1 <= value2:
		case operator == 'gt' 	&& value1 > value2:
		case operator == '>' 	&& value1 > value2:
		case operator == 'gte' 	&& value1 >= value2:
		case operator == '>=' 	&& value1 >= value2:
		case operator == 'and' 	&& value1 && value2:
		case operator == '&&' 	&& (value1 && value2):
		case operator == 'or' 	&& value1 || value2:
		case operator == '||' 	&& (value1 || value2):
		
		case operator == 'startsWith' 
		&& value1.indexOf(value2) === 0:
		
		case operator == 'endsWith' 
		&& value1.indexOf(value2) === (value1.length - value2.length):
			valid = true;
			break;
	}
	
	if(valid) {
		return options.fn(this);
	}
	
	return options.inverse(this);
});

Handlebars.registerHelper('loop', function(object, options) {
	var i = 0, buffer = '', key, total = Object.keys(object).length;

	for (key in object) {
		if (object.hasOwnProperty(key)) {
			buffer += options.fn({key: key, value: object[key], last: ++i === total});
		}
	}
 
	return buffer;
});
	
Handlebars.registerHelper('in', function(value, list, options) {
	list = list.split(',');
	for (var i = 0; i < list.length; i++) {
		if(list[i] === value) {
			return options.fn(this);
		}
	}
 
	return '';
});

Handlebars.registerHelper('notin', function(value, list, options) {
	list = list.split(',');
	for (var i = 0; i < list.length; i++) {
		if(list[i] === value) {
			return '';
		}
	}
 
	return options.fn(this);
});