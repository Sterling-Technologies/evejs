define(function() {
	var Definition = function() {}, prototype = Definition.prototype;
	
	/* Public Properties
	-------------------------------*/
	/* Private Properties
	-------------------------------*/
	/* Loader
	-------------------------------*/
	prototype.__load = Definition.load = function() {
		return new Definition();
	};
	
	/* Construct
	-------------------------------*/
	/* Public Methods
	-------------------------------*/
	prototype.path = function(key) {
		return controller.path('{{name}}/'+key);
	};
	
	prototype.getList = function(query, callback) {
		query = query || {};
		
		var url = controller.getServerUrl() + '/{{name}}';
		
		//if there is something in the query
		if(JSON.stringify(query) !== '{}') {
			url += '?' + $.hashToQuery(query);
		}
		
		if(!callback) {
			return url;
		}
		
		$.getJSON(url, callback);
		
		return this;
	};
	
	prototype.getDetail = function(id, callback) {
		var url = controller.getServerUrl() + '/{{name}}/'+id;
		
		if(!callback) {
			return url;
		}
		
		$.getJSON(url, callback);
		
		return this;
	};
	
	prototype.getErrors = function(data) {
		var errors = {};
		//VALIDATION
		//NOTE: BULK GENERATE
		{{#loop fields ~}} 
			{{~#loop value.valid ~}} 
				{{~#when value.[0] '==' 'required' ~}}
				
		if(!data.{{../../key}} || !data.{{../../key}}.length) {
			errors.{{../../key}} = '{{../../key}} is required!';
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'gt' ~}}
					{{~#when ../../value.type '==' 'string'~}} 
					
		if(data.{{../../../key}} && data.{{../../../key}}.length <= {{../../value.[1]}}) {
			errors.{{../../../key}} = '{{../../../key}} must be greater than {{../../value.[1]}}';
		}
					{{~/when~}}
					{{~#when ../../value.type '!=' 'string'~}} 
					
		if(data.{{../../../key}} && data.{{../../../key}} <= {{../../value.[1]}}) {
			errors.{{../../../key}} = '{{../../../key}} must be greater than {{../../value.[1]}}';
		}
					{{~/when~}}
				{{~/when~}}
				
				{{~#when value.[0] '==' 'gte' ~}}
					{{~#when ../../value.type '==' 'string'~}} 
					
		if(data.{{../../../key}} && data.{{../../../key}}.length < {{../../value.[1]}}) {
			errors.{{../../../key}} = '{{../../../key}} must be greater than or equal to {{../../value.[1]}}';
		}
					{{~/when~}}
					{{~#when ../../value.type '!=' 'string'~}} 
					
		if(data.{{../../../key}} && data.{{../../../key}} < {{../../value.[1]}}) {
			errors.{{../../../key}} = '{{../../../key}} must be greater than or equal to {{../../value.[1]}}';
		}
					{{~/when~}}
				{{~/when~}}
				
				{{~#when value.[0] '==' 'lt' ~}}
					{{~#when ../../value.type '==' 'string'~}} 
					
		if(data.{{../../../key}} && data.{{../../../key}}.length >= {{../../value.[1]}}) {
			errors.{{../../../key}} = '{{../../../key}} must be less than {{../../value.[1]}}';
		}
					{{~/when~}}
					{{~#when ../../value.type '!=' 'string'~}} 
					
		if(data.{{../../../key}} && data.{{../../../key}} >= {{../../value.[1]}}) {
			errors.{{../../../key}} = '{{../../../key}} must be less than {{../../value.[1]}}';
		}
					{{~/when~}}
				{{~/when~}}
				
				{{~#when value.[0] '==' 'lte' ~}}
					{{~#when ../../value.type '==' 'string'~}} 
					
		if(data.{{../../../key}} && data.{{../../../key}}.length > {{../../value.[1]}}) {
			errors.{{../../../key}} = '{{../../../key}} must be less than or equal to {{../../value.[1]}}';
		}
					{{~/when~}}
					{{~#when ../../value.type '!=' 'string'~}} 
					
		if(data.{{../../../key}} && data.{{../../../key}} > {{../../value.[1]}}) {
			errors.{{../../../key}} = '{{../../../key}} must be less than or equal to {{../../value.[1]}}';
		}
					{{~/when~}}
				{{~/when~}}
				
				{{~#when value.[0] '==' 'one' ~}}
		if(
		{{~#loop value.[1] ~}}
		data.{{../../../key}} !== '{{value.value}}'
		{{~#unless last}} 
		&& {{/unless~}}
		{{/loop}}
		) {
			errors.{{../../key}} = '{{../../key}} must be one of {{#loop value.[1] ~}}
			{{value.label}}{{~#unless last}}, {{/unless~}}{{/loop}}';
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'email' ~}}
				
		if(data.{{../../key}} && !(new RegExp(
			'^(([^<>()[\\]\\.,,:\\s@\\"]+(\\.[^<>()[\\]\\.,,:\\s@\\"]+)*)|(\\' + 
			'".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}' + 
			'\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$', 'ig'))
			.test(data.{{../../key}})) {
			errors.{{../../key}} = '{{../../key}} is not a valid email';
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'hex' ~}}
				
		if(data.{{../../key}} && !(new RegExp(
			'^[0-9a-fA-F]{6}$', 'ig'))
			.test(data.{{../../key}})) {
			errors.{{../../key}} = '{{../../key}} is not a valid hexadecimal';
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'cc' ~}}
				
		if(data.{{../../key}} && !(new RegExp(
			'^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3' +
			'[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\\d{3})\\d{11})$', 'ig'))
			.test(data.{{../../key}})) {
			errors.{{../../key}} = '{{../../key}} is not a valid credit card';
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'html' ~}}
				
		if(data.{{../../key}} && !(new RegExp(
			'<\\/?\\w+((\\s+(\\w|\\w[\\w-]*\\w)(\\s*=\\s*(?:\\".*?' + 
			'\\"|\'.*?\'|[^\'\\">\\s]+))?)+\\s*|\\s*)\\/?>', 'ig'))
			.test(data.{{../../key}})) {
			errors.{{../../key}} = '{{../../key}} is not valid HTML';
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'url' ~}}
				
		if(data.{{../../key}} && !(new RegExp(
			'^(http|https|ftp):\\/\\/([A-Z0-9][A-Z0-9_-]*(?:.[A-Z0-9][A-Z0-9_-]*)+):?(d+)?\\/?', 'ig'))
			.test(data.{{../../key}})) {
			errors.{{../../key}} = '{{../../key}} is not a valid URL';
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'slug' ~}}
				
		if(data.{{../../key}} && !(new RegExp(
			'^[a-z0-9-]+', 'ig'))
			.test(data.{{../../key}})) {
			errors.{{../../key}} = '{{../../key}} is not a valid slug';
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'alphanum' ~}}
				
		if(data.{{../../key}} && !(new RegExp(
			'^[a-zA-Z0-9]+$', 'ig'))
			.test(data.{{../../key}})) {
			errors.{{../../key}} = '{{../../key}} must be alpha-numeric';
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'alphanumhyphen' ~}}
				
		if(data.{{../../key}} && !(new RegExp(
			'^[a-zA-Z0-9-]+$', 'ig'))
			.test(data.{{../../key}})) {
			errors.{{../../key}} = '{{../../key}} must be alpha-numeric-hyphen';
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'alphanumscore' ~}}
				
		if(data.{{../../key}} && !(new RegExp(
			'^[a-zA-Z0-9_]+$', 'ig'))
			.test(data.{{../../key}})) {
			errors.{{../../key}} = '{{../../key}} must be alpha-numeric-underscore';
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'alphanumline' ~}}
				
		if(data.{{../../key}} && !(new RegExp(
			'^[a-zA-Z0-9-_]+$', 'ig'))
			.test(data.{{../../key}})) {
			errors.{{../../key}} = '{{../../key}} must be alpha-numeric-hyphen-underscore';
		}
		
				{{~/when~}}
				
				{{~#when value.[0] '==' 'regex' ~}}
				
		if(data.{{../../key}} && !(new RegExp(
			'{{../value.[1]}}', 'ig'))
			.test(data.{{../../key}})) {
			errors.{{../../key}} = '{{../../key}} is not valid';
		}
		
				{{~/when~}}
		{{~#if last}} 
		
		{{else}} else {{/if~}}
		
			{{~/loop~}}	
		{{~/loop}}
		return errors;
	};
	
	prototype.create = function(data, files, callback) {
		var url = controller.getServerUrl() + '/{{name}}/create';
		
		//SERVER CONVERT
		//NOTE: BULK GENERATE
		{{#loop fields ~}}
		{{~#if value.field ~}}
		{{~#when value.field.[0] '==' 'datetime' ~}}
		if(data.{{../../key}}) {
			data.{{../../key}} = _convertToServerDate(data.{{../../key}});
		}
		
		{{/when~}}
		{{~#when value.field.[0] '==' 'date' ~}}
		if(data.{{../../key}}) {
			data.{{../../key}} = _convertToServerDate(data.{{../../key}});
		}
		
		{{/when~}}
		{{~#when value.field.[0] '==' 'time' ~}}
		if(data.{{../../key}}) {
			data.{{../../key}} = _convertToServerDate(data.{{../../key}});
		}
		
		{{/when~}}
		{{~/if~}}
		{{~/loop~}}
		
		_send(url, data, files, callback);
		
		return this;
	};
	
	prototype.update = function(id, data, files, callback) {
		var url = controller.getServerUrl() + '/{{name}}/update/' + id;
		
		//SERVER CONVERT
		//NOTE: BULK GENERATE
		{{#loop fields ~}}
		{{~#if value.field ~}}
		{{~#when value.field.[0] '==' 'datetime' ~}}
		if(data.{{../../key}}) {
			data.{{../../key}} = _convertToServerDate(data.{{../../key}});
		}
		
		{{/when~}}
		{{~#when value.field.[0] '==' 'date' ~}}
		if(data.{{../../key}}) {
			data.{{../../key}} = _convertToServerDate(data.{{../../key}});
		}
		
		{{/when~}}
		{{~#when value.field.[0] '==' 'time' ~}}
		if(data.{{../../key}}) {
			data.{{../../key}} = _convertToServerDate(data.{{../../key}});
		}
		
		{{/when~}}
		{{~/if~}}
		{{~/loop~}}
		
		//save data to databases
		_send(url, data, files, callback);
	};
	
	/* Private Methods
	-------------------------------*/
	var _convertToServerDate = function(string) {
		if(typeof string !== 'number') {
			string = '' + string;
			if(!string || !string.length) {
				return '';
			}
		}
		
		var date 	= new Date(string);
		var offset	= (new Date()).getTimezoneOffset() * 60000;
		
		date = new Date( date.getTime() + offset);
		
		var month 	= (date.getMonth() + 1) + '';
		var day 	= date.getDate() + '';
		var year 	= date.getFullYear();	
		
		var hour 	= date.getHours() + '';
		var minute = date.getMinutes() + '';
		var second = date.getSeconds() + '';
		
		if(month.length === 1) {
			month = '0' + month;
		}
		
		if(day.length === 1) {
			day = '0' + day;
		}
		
		if(hour.length === 1) {
			hour = '0' + hour;
		}
		
		if(minute.length === 1) {
			minute = '0' + minute;
		}
		
		if(second.length === 1) {
			second = '0' + second;
		}
		
		date = year + '-' + month + '-' + day;
		var time = hour + ':' + minute + ':' + second;
		
		return date + 'T' + time + 'Z';
	};
	
	var _send = function(url, data, files, callback) {
		data 	= data 	|| {};
		files 	= files || {}; 
		
		var form = new FormData(), key, i;
		
		//append the regular field name and value
		for(key in data) {
			if(data.hasOwnProperty(key)) {
				form.append(key, data[key]);
			}
		}
		
		//append files per name
		for(key in files) {
			if(files.hasOwnProperty(key)) {
				//a field can have multiple files
				for(i = 0; i < files[key].length; i++) {
					form.append(key, files[key][i]);
				}
			}
		}
		
		// Need to use jquery ajax
		// so that auth can catch
		// up request, and append access
		// token into it
		$.ajax({
			url 	: url,
			type 	: 'POST',
			// custom xhr
			xhr 	: function() {
				var jqxhr = $.ajaxSettings.xhr();

				if(jqxhr.upload) {
					// On Progress
					jqxhr.upload.addEventListener('progress', function(e) {
						var percentComplete = 0;
						if (e.lengthComputable) {
							percentComplete = Math.round(e.loaded * 100 / e.total);
						}
						
						callback(null, percentComplete.toString());
					}, false);

					//on error
					jqxhr.upload.addEventListener('error', function () {
						//TODO: Show error message
						//ex. There was an error attempting to upload the file.
						callback('An error occured while submitting the form', 0);
					}, false);
						
					// On cancel.
					jqxhr.upload.addEventListener('abort', function () {
						//TODO: Show abort message
						//The upload has been canceled by the user or the browser dropped the connection.
						callback('Submission aborted, please check internet connection', 0);
					}, false);

					return jqxhr;
				}
			},
			// form data
			data  		: form,
			// disable cache
			cache 		: false,
			// do not set content type
			contentType : false,
			// do not proccess data
			processData : false,
			// on success
			success : function(response) {
				response = JSON.parse(response);
				callback(null, 100, response);
			}
		});
	};
	
	/* Adaptor
	-------------------------------*/
	return Definition.load(); 
});