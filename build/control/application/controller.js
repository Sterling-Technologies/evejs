var controller = function() {
	var c = function() {}, public = c.prototype;
	
	/* Public Properties
	-------------------------------*/
	public.cdn		= 'http://control.eve.dev';
	public.menu 	= []; 
	
	/* Private Properties
	-------------------------------*/
	var $			= jQuery;
	var _paths 		= {};
	var _refresh 	= false; //quirk
	
	/* Loader
	-------------------------------*/
	public.__load = c.load = function() {
		if(!this.__instance) {
			this.__instance = new c();
		}
		
		return this.__instance;
	};
	
	/* Construct
	-------------------------------*/
	/* Public Methods
	-------------------------------*/
	/**
	 * Alters a function to bind 
	 * a scope and add extra arguments
	 *
	 * @param function*
	 * @param object* scope
	 * @param [mixed[,mixed..]]
	 * @return function
	 */
	public.alter = function(callback, scope) {
		//get arguments
		var self = this, args = public.args();
		
		//take the callback and the scope
		//out of the arguments
		callback 	= args.shift(),
		scope 		= args.shift();
		
		//we are returning a function
		return function() {
			//get the active arguments
			var i, original = public.args();
			
			//add the extra arguments to the
			//original list of arguments
			for(i = 0; i < args.length; i++) {
				original.push(args[i]);
			}
			
			//now call the intended function with bounded arguments
			return callback.apply(scope || this, original);
		};
	};
	
	/**
	 * Returns an array form of arguments
	 *
	 * @return array
	 */
	public.args = function() {
		return Array.prototype.slice.apply(arguments.callee.caller.arguments);
	};
	
	/**
	 * Get's a configuration
	 *
	 * @param string
	 * @return this
	 */
	public.config = function(key, callback) {
		require([this.path('config') + '/' + key + '.js'], callback);
		return this;
	};
	
	/**
	 * Converts hash to query string
	 *
	 * @return string
	 */
	public.hashToQuery = function(hash, prefix) {
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
	};
	
	/**
	 * Global event listener for the server
	 *
	 * @return this
	 */
	public.listen = function(event, callback) {
		$(window).on(event, callback);
		return this;
	};
	
	/**
	 * Returns the path given the key
	 *
	 * @param string
	 * @return this
	 */
	public.path = function(key, value) {
		if(value) {
			_paths[key] = value;
			return this;
		}
		
		return _paths[key];
	};
	
	/**
	 * Converts a query string to an object
	 *
	 * @return Eden.object
	 */
	public.queryToHash = function(query) {
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
	};
	
	/**
	 * Sets a global template partial
	 *
	 * @param string partial name
	 * @param string template
	 */
	public.setPartial = function(key, template) {
		Handlebars.registerPartial(key, template);
		return this;
	};
	
	/**
	 * Set template engine
	 *
	 * @return this
	 */
	public.setTemplateEngine = function() {
		Handlebars.registerHelper('when', function (value1, operator, value2, options) {
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
					valid = true;
					break;
			}
			
			if(valid) {
				return options.fn(this);
			}
			
			return options.inverse(this);
		});
		
		//if sequence
		if(typeof arguments[0] == 'function') {
			arguments[0]();
		}
		
		return this;
	};
	
	/**
	 * Converts time to a readable formatted date
	 *
	 * @param int
	 * @param bool
	 * @param bool
	 * @return string
	 */
	public.timeToDate = function(time, addTime, longformat) {
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
	public.timeToRelative = function(time) {
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
	};
	
	/**
	 * Global event trigger for the server
	 *
	 * @return this
	 */
	public.trigger = function() {
		$(window).trigger.apply($(window), arguments);
		return this;
	};
	
	/* Bootstrap Methods
	-------------------------------*/
	/**
	 * Render Page
	 *
	 * @return this
	 */
	public.renderPage = function() {
		var self 		= this, 
			//get args for sequence
			args 		= arguments, 
			//default templates
			templates 	= [
				'text!' + this.path('template') + '/_page.html',
				'text!' + this.path('template') + '/_head.html',
				'text!' + this.path('template') + '/_foot.html',
				'text!' + this.path('template') + '/_menu.html'];
		
		//require all the default templates
		require(templates, function(page, head, foot, menu) {
			//allow any package to add to the menu
			self.trigger('menu', [self.menu]);
			
			//render head
			head = Handlebars.compile(head)({ right: false });
			
			//render menu
			menu = Handlebars.compile(menu)({ items: self.menu });
			
			//render page
			$(document.body).html(Handlebars.compile(page)({
				head		: head,
				foot		: foot,
				menu		: menu
			}));
			
			//listen for a change in url
			self.listen('request', function(e) {
				//find all menu items
				$('#sidebar li')
				//make them inactive
				.removeClass('active')
				//for each link in the items
				.find('a').each(function() {
					//if the url starts with whats in the link
					if(window.location.href.indexOf(this.href) === 0) {
						//set the item active
						$(this).parent('li').addClass('active');
					}
				});
			});
			
			//if sequence
			if(typeof args[0] == 'function') {
				//call the next
				args[0]();
			}
		});
		
		return this;
	};
	
	/**
	 * Sequence asyncronous event request
	 *
	 * @param string
	 * @return this
	 */
	public.sequenceTrigger = function(event, next) {
		this.trigger(event);
		next();
		
		return this;
	};
	
	/**
	 * Starts up any packages
	 *
	 * @return this
	 */
	public.startPackages = function() {
		//get args for sequence
		var self = this, args = arguments;
		
		//get packages
		this.config('packages', function(packages) {
			//compile a list of index.js found in each package
			var list = [];
			
			//for each package
			for(var i = 0; i < packages.length; i++) {
				//create the path and push it into the list
				list.push(self.path('packages') + '/' + packages[i] + '/index');
			}
			
			//now we can bulk require all the packages
			require(list, function() {			
				//if sequence
				if(typeof args[0] == 'function') {
					//call next
					args[0]();
				}
			});
		});
		
		return this;
	};
	
	/**
	 * Set paths
	 *
	 * @return this
	 */
	public.setLoader = function() {
		require.config({
			paths: { text: this.cdn + '/scripts/text' },
			config: {
				text: {
					useXhr: function (url, protocol, hostname, port) {
						// allow cross-domain requests
						// remote server allows CORS
						return true;
					}
				}
			}
		});
		
		//if sequence
		if(typeof arguments[0] == 'function') {
			arguments[0]();
		}
		
		return this;
	};
	
	/**
	 * Set paths
	 *
	 * @return this
	 */
	public.setPaths = function() {
		this.path('cdn'		, this.cdn)
			.path('root'	, this.cdn + '/application')
			.path('config'	, this.cdn + '/application/config')
			.path('template', this.cdn + '/application/template')
			.path('packages', this.cdn + '/application/packages');
		
		//if sequence
		if(typeof arguments[0] == 'function') {
			arguments[0]();
		}
		
		return this;
	};
	
	/**
	 * Process to start server
	 *
	 * @return this
	 */
	public.startClient = function() {
		//from a refresh - quirk
		_refresh = true;
		
		//hijack url changes
		_hijackPushState();
		_hijackPopState();
		//hijack links
		_hijackLinks();
		//hijack forms
		_hijackForms();
		
		//listen for a url request
		this.listen('request', function() {
			//from a refresh - quirk
			_refresh = false;
		}).trigger('request');
		
		//if sequence
		if(typeof arguments[0] == 'function') {
			arguments[0]();
		}
		
		return this;
	};
	
	/* Page Methods
	-------------------------------*/
	/**
	 * Adds an alert message
	 *
	 * @param string
	 * @param string
	 * @param string
	 * @return this
	 */
	public.addMessage = function(message, type, icon) {
		icon = icon || 'okay';
		type = type || 'success';
		
		//get the alert template
		require(['text!' + this.path('template') + '/_alert.html'], function(template) {
			//add the message to the messages container
			$('#messages').append(Handlebars.compile(template)({
				type	: type,
				message	: message,
				icon	: icon
			}));
		});
		
		return this;
	};
	
	/**
	 * Sets page body
	 *
	 * @param array
	 * @return this
	 */
	public.setBody = function(template, variables) {
		var self = this, templates = ['text!' + template];
		
		variables 	= variables || {};
		
		//bulk load the templates
		require(templates, function(template) {
			//render the body
			$('#body').html(Handlebars.compile(template)(variables));
			
			//trigger body event
			self.trigger('body');
		});
		
		return this;
	};
	
	/**
	 * Sets page crumbs
	 *
	 * @param array
	 * @return this
	 */
	public.setCrumbs = function(crumbs) {
		//get the global crumbs template
		require(['text!' + this.path('template') + '/_crumbs.html'], function(template) {
			//add the crumbs to the breadcrumbs container
			$('#breadcrumbs').html(Handlebars.compile(template)({ crumbs: crumbs }));
		});
		
		return this;
	};
	
	/**
	 * Sets page header
	 *
	 * @param string
	 * @return this
	 */
	public.setHeader = function(header) {
		$('#header-title').html(header);
		return this;
	};
	
	/**
	 * Sets page subheader
	 *
	 * @param string
	 * @return this
	 */
	public.setSubheader = function(subheader) {
		$('#subheader-title').html(subheader);
		return this;
	};
	
	/**
	 * Sets page title
	 *
	 * @param string
	 * @return this
	 */
	public.setTitle = function(title) {
		$('head title').html(title);
		return this;
	};
	
	/* Private Methods
	-------------------------------*/
	var _hijackPushState = function() {
		//remember the push state
		var pushState = window.history.pushState;
		
		//override the function
		window.history.pushState = function(state) {
			if (typeof window.history.onpushstate == 'function') {
				window.history.onpushstate({state: state});
			}
			
			var results = pushState.apply(history, arguments);
			
			//now trigger something special
			var event = jQuery.Event('request');
			event.state = state;
			$(window).trigger(event);
			
			return results;
		}
	};
	
	var _hijackPopState = function() {
		window.onpopstate = function (e) {
			//from a refresh - quirk
			if(_refresh) {
				_refresh = false;
				return;
			}
			
			//now trigger something special
			var event = jQuery.Event('request');
			event.state = e.state;
			$(window).trigger(event);
		};
	};
	
	var _hijackLinks = function() {
		//live listen to all links
		$(document.body).on('click', 'a', function(e) {
			//if the link is in the same domain
			if(this.href.indexOf(window.location.origin) === 0) {
				//stop it
				e.preventDefault();
				//push the state
				window.history.pushState({}, '', this.href);
			}
		})
	};
	
	var _hijackForms = function() {
		//listen to form submits
		$(document.body).on('submit', 'form', function(e) {
			//if the action is in the same domain
			if(this.action.indexOf(window.location.origin) === 0) {
				//stop it
				e.preventDefault();
				//push the state
				window.history.pushState({}, '', this.action);
			}
		})
	};
	
	/* Adaptor
	-------------------------------*/
	return c.load(); 
}();