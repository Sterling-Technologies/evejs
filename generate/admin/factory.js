define(function() {
	return jQuery.eve.base.extend(function() {
		/* Require
		-------------------------------*/
		var $ = jQuery;
		
		/* Constants
		-------------------------------*/
		/* Public.Properties
		-------------------------------*/
		/* Protected Properties
		-------------------------------*/
		/* Private Properties
		-------------------------------*/
		/* Magic
		-------------------------------*/
		/* Public.Methods
		-------------------------------*/
		/**
		 * Returns path related to {{name}}
		 *
		 * @param string key name
		 * @return string absolute path
		 */
		this.path = function(key) {
			return this.___parent.path('{{name}}/' + key);
		};
		
		/**
		 * Gets a list from the server
		 *
		 * @param object the query
		 * @param function callback
		 * @return string|this
		 */
		this.getList = function(query, callback) {
			query = query || {};
			
			var url = this.getServerUrl() + '/{{name}}';
			
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
		
		/**
		 * Gets a detail row from the server
		 *
		 * @param string the id
		 * @param function callback
		 * @return this|string
		 */
		this.getDetail = function(id, callback) {
			var url = this.getServerUrl() + '/{{name}}/'+id;
			
			if(!callback) {
				return url;
			}
			
			$.getJSON(url, callback);
			
			return this;
		};
		
		/**
		 * Validates fields to be sent to the server
		 * and returns errors
		 *
		 * @param object
		 * @return object hash of errors
		 */
		this.getErrors = function(data) {
			var errors = {};
			//VALIDATION
			//NOTE: BULK GENERATE
			{{#loop fields ~}} 
				{{~#loop value.valid ~}} 
					{{~#when value.[0] '==' 'required' ~}}
					
			if(!data.{{../../key}} || !data.{{../../key}}.length) {
				errors.{{../../key}} = '{{../../value.label}} is required!';
			}
			
					{{~/when~}}
					
					{{~#when value.[0] '==' 'gt' ~}}
						{{~#when ../../value.type '==' 'string'~}} 
						
			if(data.{{../../../key}} && data.{{../../../key}}.length <= {{../../value.[1]}}) {
				errors.{{../../../key}} = '{{../../../value.label}} must be greater than {{../../value.[1]}}';
			}
						{{~/when~}}
						{{~#when ../../value.type '!=' 'string'~}} 
						
			if(data.{{../../../key}} && data.{{../../../key}} <= {{../../value.[1]}}) {
				errors.{{../../../key}} = '{{../../../value.label}} must be greater than {{../../value.[1]}}';
			}
						{{~/when~}}
					{{~/when~}}
					
					{{~#when value.[0] '==' 'gte' ~}}
						{{~#when ../../value.type '==' 'string'~}} 
						
			if(data.{{../../../key}} && data.{{../../../key}}.length < {{../../value.[1]}}) {
				errors.{{../../../key}} = '{{../../../value.label}} must be greater than or equal to {{../../value.[1]}}';
			}
						{{~/when~}}
						{{~#when ../../value.type '!=' 'string'~}} 
						
			if(data.{{../../../key}} && data.{{../../../key}} < {{../../value.[1]}}) {
				errors.{{../../../key}} = '{{../../../value.label}} must be greater than or equal to {{../../value.[1]}}';
			}
						{{~/when~}}
					{{~/when~}}
					
					{{~#when value.[0] '==' 'lt' ~}}
						{{~#when ../../value.type '==' 'string'~}} 
						
			if(data.{{../../../key}} && data.{{../../../key}}.length >= {{../../value.[1]}}) {
				errors.{{../../../key}} = '{{../../../value.label}} must be less than {{../../value.[1]}}';
			}
						{{~/when~}}
						{{~#when ../../value.type '!=' 'string'~}} 
						
			if(data.{{../../../key}} && data.{{../../../key}} >= {{../../value.[1]}}) {
				errors.{{../../../key}} = '{{../../../value.label}} must be less than {{../../value.[1]}}';
			}
						{{~/when~}}
					{{~/when~}}
					
					{{~#when value.[0] '==' 'lte' ~}}
						{{~#when ../../value.type '==' 'string'~}} 
						
			if(data.{{../../../key}} && data.{{../../../key}}.length > {{../../value.[1]}}) {
				errors.{{../../../key}} = '{{../../../value.label}} must be less than or equal to {{../../value.[1]}}';
			}
						{{~/when~}}
						{{~#when ../../value.type '!=' 'string'~}} 
						
			if(data.{{../../../key}} && data.{{../../../key}} > {{../../value.[1]}}) {
				errors.{{../../../key}} = '{{../../../value.label}} must be less than or equal to {{../../value.[1]}}';
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
				errors.{{../../key}} = '{{../../value.label}} must be one of {{#loop value.[1] ~}}
				{{value.label}}{{~#unless last}}, {{/unless~}}{{/loop}}';
			}
			
					{{~/when~}}
					
					{{~#when value.[0] '==' 'email' ~}}
					
			if(data.{{../../key}} && !(new RegExp(
				'^(([^<>()[\\]\\.,,:\\s@\\"]+(\\.[^<>()[\\]\\.,,:\\s@\\"]+)*)|(\\' + 
				'".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}' + 
				'\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$', 'ig'))
				.test(data.{{../../key}})) {
				errors.{{../../key}} = '{{../../value.label}} is not a valid email';
			}
			
					{{~/when~}}
					
					{{~#when value.[0] '==' 'hex' ~}}
					
			if(data.{{../../key}} && !(new RegExp(
				'^[0-9a-fA-F]{6}$', 'ig'))
				.test(data.{{../../key}})) {
				errors.{{../../key}} = '{{../../value.label}} is not a valid hexadecimal';
			}
			
					{{~/when~}}
					
					{{~#when value.[0] '==' 'cc' ~}}
					
			if(data.{{../../key}} && !(new RegExp(
				'^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3' +
				'[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\\d{3})\\d{11})$', 'ig'))
				.test(data.{{../../key}})) {
				errors.{{../../key}} = '{{../../value.label}} is not a valid credit card';
			}
			
					{{~/when~}}
					
					{{~#when value.[0] '==' 'html' ~}}
					
			if(data.{{../../key}} && !(new RegExp(
				'<\\/?\\w+((\\s+(\\w|\\w[\\w-]*\\w)(\\s*=\\s*(?:\\".*?' + 
				'\\"|\'.*?\'|[^\'\\">\\s]+))?)+\\s*|\\s*)\\/?>', 'ig'))
				.test(data.{{../../key}})) {
				errors.{{../../key}} = '{{../../value.label}} is not valid HTML';
			}
			
					{{~/when~}}
					
					{{~#when value.[0] '==' 'url' ~}}
					
			if(data.{{../../key}} && !(new RegExp(
				'^(http|https|ftp):\\/\\/([A-Z0-9][A-Z0-9_-]*(?:.[A-Z0-9][A-Z0-9_-]*)+):?(d+)?\\/?', 'ig'))
				.test(data.{{../../key}})) {
				errors.{{../../key}} = '{{../../value.label}} is not a valid URL';
			}
			
					{{~/when~}}
					
					{{~#when value.[0] '==' 'slug' ~}}
					
			if(data.{{../../key}} && !(new RegExp(
				'^[a-z0-9-]+', 'ig'))
				.test(data.{{../../key}})) {
				errors.{{../../key}} = '{{../../value.label}} is not a valid slug';
			}
			
					{{~/when~}}
					
					{{~#when value.[0] '==' 'alphanum' ~}}
					
			if(data.{{../../key}} && !(new RegExp(
				'^[a-zA-Z0-9]+$', 'ig'))
				.test(data.{{../../key}})) {
				errors.{{../../key}} = '{{../../value.label}} must be alpha-numeric';
			}
			
					{{~/when~}}
					
					{{~#when value.[0] '==' 'alphanumhyphen' ~}}
					
			if(data.{{../../key}} && !(new RegExp(
				'^[a-zA-Z0-9-]+$', 'ig'))
				.test(data.{{../../key}})) {
				errors.{{../../key}} = '{{../../value.label}} must be alpha-numeric-hyphen';
			}
			
					{{~/when~}}
					
					{{~#when value.[0] '==' 'alphanumscore' ~}}
					
			if(data.{{../../key}} && !(new RegExp(
				'^[a-zA-Z0-9_]+$', 'ig'))
				.test(data.{{../../key}})) {
				errors.{{../../key}} = '{{../../value.label}} must be alpha-numeric-underscore';
			}
			
					{{~/when~}}
					
					{{~#when value.[0] '==' 'alphanumline' ~}}
					
			if(data.{{../../key}} && !(new RegExp(
				'^[a-zA-Z0-9-_]+$', 'ig'))
				.test(data.{{../../key}})) {
				errors.{{../../key}} = '{{../../value.label}} must be alpha-numeric-hyphen-underscore';
			}
			
					{{~/when~}}
					
					{{~#when value.[0] '==' 'regex' ~}}
					
			if(data.{{../../key}} && !(new RegExp(
				'{{../value.[1]}}', 'ig'))
				.test(data.{{../../key}})) {
				errors.{{../../key}} = '{{../../value.label}} is not valid';
			}
			
					{{~/when~}}
			{{~#if last}} 
			
			{{else}} else {{/if~}}
			
				{{~/loop~}}	
			{{~/loop}}
			return errors;
		};
		
		/**
		 * Sends a create command to the server
		 *
		 * @param object
		 * @return {fojo}
		 */
		this.create = function(data, callback) {
			var url = this.getServerUrl() + '/{{name}}/create';
			
			//use fojo to send to db
			return $.fojo()
				.setUrl(url)
				.setData(data)
				.setMethod('post')
				
				.once('abort', function(e) {
					callback(e, null);
				})
				
				.once('error', function(e) {
					callback(e, null);
				})
				
				.once('response', function(e, response) {
					response = JSON.parse(response);
					callback(null, response);	
				});
		};
		
		/**
		 * Sends an update command to the server
		 *
		 * @param string id
		 * @param object
		 * @param function callback
		 * @return {fojo}
		 */
		this.update = function(id, data, callback) {
			var url = this.getServerUrl() + '/{{name}}/update/' + id;
			
			//use fojo to send to db
			return $.fojo()
				.setUrl(url)
				.setData(data)
				.setMethod('put')
				
				.once('abort', function(e) {
					callback(e, null);
				})
				
				.once('error', function(e) {
					callback(e, null);
				})
				
				.once('response', function(e, response) {
					response = JSON.parse(response);
					callback(null, response);	
				});
		};
		
		/**
		 * Sends a remove command to the server
		 *
		 * @param string id
		 * @param function callback
		 * @return this
		 */
		this.remove = function(id, callback) {
			var url = this.getServerUrl() + '/{{name}}/remove/' + id;
			
			$.ajax({
				url 	: url,
				type 	: 'DELETE',
				// disable cache
				cache 		: false,
				// do not set content type
				contentType : false,
				// do not proccess data
				processData : false,
				// on error
				error: function(xhr, status, message) {
					callback(error, null);
				},
				// on success
				success : function(response) {
					response = JSON.parse(response);
					callback(null, response);
				}.bind(this) 
			});
			
			return this;
		};
		
		/* Protected Methods
		-------------------------------*/
		/* Private Methods
		-------------------------------*/
	}).singleton();
});