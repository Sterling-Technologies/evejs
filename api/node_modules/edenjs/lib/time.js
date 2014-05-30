module.exports = function($) {
	$.time = {};
	
	return this.define(function(public) {
		/* Public Properties
		-------------------------------*/
		public.offset = $.time.offset = (new Date()).getTimezoneOffset() * 60000;
		
		/* Private Properties
		-------------------------------*/
		/* Loader
		-------------------------------*/
		public.__load = function() {
			return new this();
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
		public.gmtNow = $.time.gmtNow = function() {
			return this.now() + this.offset;
		};
		
		/**
		 * Returns Unix time
		 *
		 * @return number
		 */
		public.now = $.time.now = function() {
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
		public.toDate = $.time.toDate = function(time, addTime, longformat) {
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
		};
		
		/**
		 * Converts time to a relative formatted date
		 *
		 * @param int
		 * @return string
		 */
		public.toRelative = $.time.toRelative = function(time) {
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
		public.toGMTRelative = $.time.toGMTRelative = function(time) {
			return this.toRelative(time - this.offset);
		};
		
		/* Private Methods
		-------------------------------*/
	});
};