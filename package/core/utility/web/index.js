controller
//when the application is configured
.listen('config', function() {
	//add some useful methods to jQuery
	jQuery.extend({
		/**
		 * Converts hash to query string
		 *
		 * @return string
		 */
		hashToQuery: function(hash, prefix) {
			var key, value, keyValue, query = [];
			for(key in hash) {
				value = hash[key];
				if(!hash.hasOwnProperty(key)) {
					continue;
				}
				
				if(prefix) {
					key = prefix + '[' + key + ']';
				}
				
				keyValue = encodeURIComponent(key) + '=' + encodeURIComponent(value);
				
				if(typeof value == 'object') {
					keyValue = arguments.callee(value, key);
				}
				
				query.push(keyValue);
			}
			
			return query.join('&');
		},
		
		/**
		 * Converts a query string to an object
		 *
		 * @return Eden.object
		 */
		queryToHash: function(query) {
			var hash = {};
			
			//if empty data
			if(query.length == 0) {
				//return empty hash
				return hash;
			}
			
			//split the query by &
			var queryArray = query.split('&');
			
			//loop through the query array
			for (var propertyArray, hashNameArray, 
			curent, next, name, value, j, i = 0; 
			i < queryArray.length; i++) {
				//split name and value
				propertyArray = queryArray[i].split('=');
				
				//url decode both name and value
				name = decodeURIComponent(propertyArray[0].replace(/\+/g, '%20'));
				value = decodeURIComponent(propertyArray[1].replace(/\+/g, '%20'));
				
				//if no value
				if (!propertyArray[1]) {
					//if no name
					if(!propertyArray[0]) {
						//do nothing
						continue;
					}
					
					value = null;
				}
				
				//At this point, we have a key and value
				
				//if no array marker
				if(name.indexOf('[') == -1) {
					//simply put it in hash
					hash[name] = value;
					//we are done
					continue;
				}
				
				//At this point, we have a hash key and value
				
				//BEFORE:
				//hash[key1][some][]
				//hash[][some][key1]
				
				hashNameArray = name.split('[');
				
				//AFTER:
				//hash, key1], some, ]
				//hash, ], some], key1]
				
				current = hash;
				for(j = 0; j < hashNameArray.length; j++) {
					//remove straggling ]
					name = hashNameArray[j].replace(']', '');
					
					//is there more names ?
					if((j + 1) == hashNameArray.length) {
						//we are done
						break;
					}
					
					//at this point there are more names
					//hash, key1, some, ]
					//hash, ], some], key1]
					
					//does it exist ? 
					if(!current[name]) {
						next =  {}
						
						//if no name
						//it is possible for numbers to be the name
						if(hashNameArray[j + 1] == ']'
						|| (!isNaN(parseFloat(hashNameArray[j + 1].replace(']', ''))) 
						&& isFinite(hashNameArray[j + 1].replace(']', '')))) {
							next = [];
						}
						
						
						//is the current an array ?
						if(current instanceof Array) {
							current.push(next);
						} else {
							current[name] = next;
						}
					}
					
					//at this point next exists
					
					//is the current an array ?
					if(current instanceof Array) {
						//traverse
						current = current[current.length - 1];
						continue;
					}
					
					//traverse
					current = current[name];
				}
				
				//is the current an array ?
				if(current instanceof Array) {
					current.push(value);
					continue;
				}
				
				//current can be undefined because it reached
				//a datatype that cannot be traversable
				if(current) {
					current[name] = value;
				}
			}
			
			return hash;
		},
		
		/**
		 * Converts time to a readable formatted date
		 *
		 * @param int
		 * @param bool
		 * @param bool
		 * @return string
		 */
		timeToDate: function(time, addTime, longformat) {
			var date = new Date(parseInt(time));
			var day = date.getDate();
	
			if(day < 10) {
				day = '0'+day;
			}
	
			var month = [
				'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
				'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	
			if(longformat) {
				month = [
					'January',     'February',     'March',    'April',
					'May',          'June',         'July',     'August',
					'September',    'October',      'November', 'December'];
			}
	
			var localDate = month[date.getMonth()] + ' '+ day;
	
			if((new Date()).getFullYear() != date.getFullYear() || longformat) {
				localDate += ', '+date.getFullYear();
			}
	
			if(addTime) {
				var hours = (date.getHours()) % 12;
				if(hours == 0) {
					hours = 12;
				}
	
				if(hours < 10) {
					hours = '0'+hours;
				}
	
				var seconds = date.getSeconds();
	
				if(seconds < 10) {
					seconds = '0'+seconds;
				}
	
				var am = date.getHours() > 12 ? 'PM' : 'AM';
	
				localDate += ' '+ hours + ':' + seconds + ' ' + am;
			}
	
			return localDate;
		},
		
		/**
		 * Converts time to a relative formatted date
		 *
		 * @param int
		 * @return string
		 */
		timeToRelative: function(time) {
			var dateNow	= new Date();
			var now 	= dateNow.getTime();
	
			var passed 	=  now - parseInt(time);
	
			var tokens 	= [
				[86400000, 'day'],
				[3600000, 'hour'],
				[60000, 'minute'],
				[5000, 'second'],
				[-5000, 'second'],
				[-60000, 'minute'],
				[-3600000, 'hour'],
				[-86400000, 'day'] ];
	
			var month = [
				'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
				'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	
			for(var prefix = '', suffix = '', i = 0; i < tokens.length; i++) {
				if(passed < tokens[i][0]) {
					continue;
				}
	
				prefix = tokens[i][0] < 0 ? 'in ': '';
				suffix = tokens[i][0] > 0 ? ' ago': '';
	
				passed = Math.floor(passed / tokens[i][0]);
	
				if(tokens[i][1] == 'second' && -5 < passed && passed < 5) {
					return 'Now';
				} 
				
				if(tokens[i][1] == 'day' && passed == 1) {
					return 'Yesterday';
				} 
				
				if(tokens[i][1] == 'day' && passed == -1) {
					return 'Tomorrow';
				} 
				
				if(tokens[i][1] == 'day') {
					var date = new Date(time);
					var day = date.getDate();
	
					if(day < 10) {
						day = '0'+day;
					}
	
					if((new Date()).getFullYear() == date.getFullYear()) {
						return month[date.getMonth()] + ' '+ day;
					}
	
					return month[date.getMonth()] + ' '+ day +', '+date.getFullYear();
				}
	
				return prefix + passed + ' ' + tokens[i][1]+(passed == 1 ? '' : 's')+suffix;
			}
			
			return this.timeToDate(time);
		}
	});
});