module.exports = function(settings, content, data) {
	var eden			= settings.eden,
		copy			= settings.copy,
		normalize 	= settings.normalize,
		validation 		= [];
	
	//for each fields
	eden('hash').each(data.fields, function(name, field) {
		field = normalize(field);
		
		var variable 	= 'data.' + name;
		var conditional = [];
		
		//enum
		if(field.options instanceof Array) {
			var equalsOne = [], values = [];
			
			for(var i = 0; i < field.options.length; i++) {
				values.push(field.options[i].value);
				equalsOne.push(variable + ' !== \'' + field.options[i].value + '\'');
			}
			
			conditional.push([
				variable + ' && ' + equalsOne.join(" \n		&& "), 
				field.label + ' must be one of ' + values.join(', ')]);
		}
		
		eden('array').each(field.valid || [], function(i, method) {
			if(!(method instanceof Array)) {
				return;
			}
			
			switch(method[0]) {
				case 'required':
					conditional.push([
						'!' + variable + ' || !' + variable + '.length', 
						field.label + ' is required!']);
						break;
				case 'gt':
					if(field.type === 'number') {
						conditional.push([
							variable + ' && ' + variable + ' <= ' + method[1], 
							field.label + ' must be greater than ' + method[1]]);
						break;
					}
					
					conditional.push([
						variable + ' && ' + variable + '.length <= ' + method[1], 
						field.label + ' characters must be greater than ' + method[1]]);
					break;
				case 'gte':
					if(field.type === 'number') {
						conditional.push([
							variable + ' && ' + variable + ' < ' + method[1], 
							field.label + ' must be greater than or equal to ' + method[1]]);
						break;
					}
					
					conditional.push([
						variable + ' && ' + variable + '.length < ' + method[1], 
						field.label + ' characters must be greater than or equal to' + method[1]]);
					break;
				case 'lt':
					if(field.type === 'number') {
						conditional.push([
							variable + ' && ' + variable + ' >= ' + method[1], 
							field.label + ' must be less than ' + method[1]]);
						break;
					}
					
					conditional.push([
						variable + ' && ' + variable + '.length >= ' + method[1], 
						field.label + ' characters must be less than ' + method[1]]);
					break;
				case 'lte':
					if(field.type === 'number') {
						conditional.push([
							variable + ' && ' + variable + ' > ' + method[1], 
							field.label + ' must be less than or equal to ' + method[1]]);
						break;
					}
					
					conditional.push([
						variable + ' && ' + variable + '.length > ' + method[1], 
						field.label + ' characters must be less than or equal to' + method[1]]);
					break;
				case 'email':
					conditional.push([
						variable + ' && ' + "!(new RegExp('"+copy.valid.email+"', 'ig')).test("+variable+")", 
						field.label + ' must be a valid email.']);
					break;
				case 'hex':
					conditional.push([
						variable + ' && ' + "!(new RegExp('"+copy.valid.hex+"', 'ig')).test("+variable+")", 
						field.label + ' must be a valid hex.']);
					break;
				case 'cc':
					conditional.push([
						variable + ' && ' + "!(new RegExp('"+copy.valid.cc+"', 'ig')).test("+variable+")",
						field.label + ' must be a valid credit card.']);
					break;
				case 'html':
					conditional.push([
						variable + ' && ' + "!(new RegExp('"+copy.valid.html+"', 'ig')).test("+variable+")", 
						field.label + ' must be valid html.']);
					break;
				case 'url':
					conditional.push([
						variable + ' && ' + "!(new RegExp('"+copy.valid.url+"', 'ig')).test("+variable+")", 
						field.label + ' must be a valid url.']);
					break;
				case 'slug':
					conditional.push([
						variable + ' && ' + "!(new RegExp('"+copy.valid.slug+"', 'ig')).test("+variable+")", 
						field.label + ' must be a valid slug.']);
					break;
				case 'alphanum':
					conditional.push([
						variable + ' && ' + "!(new RegExp('"+copy.valid.alphanum+"', 'ig')).test("+variable+")", 
						field.label + ' must be alpha-numeric.']);
					break;
				case 'alphanumhyphen':
					conditional.push([
						variable + ' && ' + "!(new RegExp('"+copy.valid.alphanumhyphen+"', 'ig')).test("+variable+")", 
						field.label + ' must be alpha-numeric-hyphen.']);
					break;
				case 'alphanumscore':
					conditional.push([
						variable + ' && ' + "!(new RegExp('"+copy.valid.alphanumscore+"', 'ig')).test("+variable+")", 
						field.label + ' must be alpha-numeric-underscore.']);
					break;
				case 'alphanumline':
					conditional.push([
						variable + ' && ' + "!(new RegExp('"+copy.valid.alphanumline+"', 'ig')).test("+variable+")", 
						field.label + ' must be alpha-numeric-hyphen-underscore.']);
					break;
				case 'regex':
					conditional.push([
						variable + ' && ' + "!(new RegExp('"+method[1]+"', 'ig')).test("+variable+")", 
						field.label + ' is invalid.']);
					break;
			}
		});
		
		//format conditional
		eden('array').each(conditional, function(i, condition) {
			var state = 'if';
			if(i > 0) {
				state = '} else if';
			}
			validation.push('//' + condition[1]);
			validation.push(state + '(' + condition[0] + ') {');
			validation.push('    errors.' + name + ' = \'' + condition[1] + '\';');
			if((i + 1) === conditional.length) {
				validation.push('}');
				validation.push('');
			}
		});
	});
	
	return eden('string').replace(content, /{CONTROL_VALIDATION}/g	, validation.join("\n		"));
};
