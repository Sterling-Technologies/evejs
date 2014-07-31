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
		return controller.path('{SLUG}/'+key);
	};
	
	prototype.getList = function(query, callback) {
		query = query || {};
		
		var url = controller.getServerUrl() + '/{SLUG}';
		
		//if there is something in the query
		if(JSON.stringify(query) !== '{}') {
			url += '?' + $.hashToQuery(query);
		}
		
		$.getJSON(url, callback);
		
		return this;
	};
	
	prototype.getDetail = function(id, callback) {
		var url = controller.getServerUrl() + '/{SLUG}/'+id;
		
		$.getJSON(url, callback);
		
		return this;
	};
	
	prototype.getErrors = function(data) {
		var errors = {};
		//VALIDATION
		//NOTE: BULK GENERATE
		{WEB_VALIDATION}
		
		return errors;
	};
	
	prototype.create = function(data, callback) {
		var url = controller.getServerUrl() + '/{SLUG}/create';
		
		//SERVER CONVERT
		//NOTE: BULK GENERATE
		{WEB_SERVER_CONVERT}
		
		//save data to database
		$.post(url, data, function(response) {
			response = JSON.parse(response);
			callback(response);
		});
	};
	
	prototype.update = function(id, data, callback) {
		var url = controller.getServerUrl() + '/{SLUG}/update/' + id;
		
		//SERVER CONVERT
		//NOTE: BULK GENERATE
		{WEB_SERVER_CONVERT}
		
		//save data to database
		$.post(url, data, function(response) {
			response = JSON.parse(response);
			callback(response);
		});
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
	
	/* Adaptor
	-------------------------------*/
	return Definition.load(); 
});