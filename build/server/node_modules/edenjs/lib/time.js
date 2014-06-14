module.exports = function($) {
	return this.define(function(public) {
		/* Public Properties
		-------------------------------*/
		public.offset = (new Date()).getTimezoneOffset() * 60000;
		
		/* Private Properties
		-------------------------------*/
		/* Loader
		-------------------------------*/
		public.__load = function() {
			if(!this.__instance) {
				this.__instance = new this();
			}
			
			return this.__instance;
		};
		
		/* Construct
		-------------------------------*/
		/* Public Methods
		-------------------------------*/
		/**
		 * Returns Unix time
		 *
		 * @return number
		 */
		public.gmtNow = function() {
			return this.now() + this.offset;
		};
		
		/**
		 * Returns Unix time
		 *
		 * @return number
		 */
		public.now = function() {
			return (new Date).getTime();
		};
		
		/**
		 * Converts time to a readable formatted date
		 *
		 * @param int
		 * @param bool
		 * @param bool
		 * @return string
		 */
		public.toDate = function(time, addTime, longformat) {
			//Argument Testing
			$.load('argument')
				.test(1, 'int')
				.test(2, 'bool', 'undefined')
				.test(3, 'bool', 'undefined');
			
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
				localDate += ', '+ date.getFullYear();
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
		};
		
		/**
		 * Converts time to a relative formatted date
		 *
		 * @param int
		 * @return string
		 */
		public.toRelative = function(time) {
			//Argument Testing
			$.load('argument').test(1, 'int');
			
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
			
			return this.toDate(time);
		};
		
		/**
		 * Converts GMT time to a relative formatted date
		 *
		 * @param int
		 * @return string
		 */
		public.toGMTRelative = function(time) {
			//Argument Testing
			$.load('argument').test(1, 'int');
			
			return this.toRelative(time - this.offset);
		};
		
		/* Private Methods
		-------------------------------*/
	});
};