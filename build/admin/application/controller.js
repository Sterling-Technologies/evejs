/*
 * This file is part a custom application package.
 * (c) 2014-2015 Openovate Labs
 */
var controller = jQuery.eve.base.extend(function() {
	/* Require
	-------------------------------*/
	var $ = jQuery;
	
	/* Constants
	-------------------------------*/
	/* Public.Properties
	-------------------------------*/
	/* Protected Properties
	-------------------------------*/
	this._menu 		= []; 
	
	/* Private Properties
	-------------------------------*/
	var __settings 	= {};
	
	/* Magic
	-------------------------------*/
	/* Public.Methods
	-------------------------------*/
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
	this.addMessage = function(message, type, icon) {
		icon = icon || 'okay';
		type = type || 'success';
		
		//get the alert template
		require(['text!' + this.path('template') + '/_alert.html'], function(template) {
			//add the message to the messages container
			$('#messages').prepend(Handlebars.compile(template)({
				type	: type,
				message	: message,
				icon	: icon
			}));
		});
		
		return this;
	};
	
	/**
	 * Adds a popup notification
	 * less intrusive than message
	 *
	 * @param string
	 * @param string
	 * @param string
	 * @return this
	 */
	this.notify = function(title, message, type) {
		$.extend($.gritter.options, { position: 'bottom-right' });
		
		$.gritter.add({ title: title, text: message, class_name: 'gritter-'+type });
		
		return this;
	};
	
	/**
	 * Sets page body
	 *
	 * @param string
	 * @return this
	 */
	this.setBody = function(html) {
		$('#body').html(html);
			
		//trigger body event
		return this.trigger('body');
	};
	
	/**
	 * Sets page crumbs
	 *
	 * @param array
	 * @return this
	 */
	this.setCrumbs = function(crumbs) {
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
	this.setHeader = function(header) {
		$('#header-title').html(header);
		return this;
	};
	
	/**
	 * Sets page subheader
	 *
	 * @param string
	 * @return this
	 */
	this.setSubheader = function(subheader) {
		$('#subheader-title').html(subheader);
		return this;
	};
	
	/**
	 * Sets page title
	 *
	 * @param string
	 * @return this
	 */
	this.setTitle = function(title) {
		$('head title').html(title);
		return this;
	};
	
	/* Bootstrap Methods
	-------------------------------*/
	/**
	 * Render Page
	 *
	 * @return this
	 */
	this.renderPage = function(callback) {
		callback = callback || $.noop;
		
		var self 		= this, 
			_menu		= this._menu,
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
			self.trigger('menu', [_menu]);
			//render head
			head = Handlebars.compile(head)({ right: true });
			
			//render menu
			menu = Handlebars.compile(menu)({ items: _menu });
			
			//render page
			$(document.body).html(Handlebars.compile(page)({
				head		: head,
				foot		: foot,
				menu		: menu
			}));
			
			//listen for a change in url
			self.on('request', function(e) {
				//find all menu items
				$('#sidebar li')
				//make them inactive
				.removeClass('active')
				//for each link in the items
				.find('a').each(function() {
					//if the url starts with whats in the link
					if(window.location.href.indexOf(this.href) === 0
					|| window.location.pathname.indexOf(this.href) === 0) {
						//set the item active
						$(this).parent('li').addClass('active');
					}
				});
			});
			
			callback();
		});
		
		return this;
	};
	
	/**
	 * Starts up any packages
	 *
	 * @return this
	 */
	this.startPackages = function(callback) {
		callback = callback || $.noop;
		
		//get args for sequence
		var self = this, args = arguments;
		
		//get packages
		this.config('packages', function(packages) {
			//compile a list of index.js found in each package
			var list = [];
			
			//for each package
			for(var i = 0; i < packages.length; i++) {
				//create the path and push it into the list
				list.push(self.path('package') + '/' + packages[i] + '/index.js');
			}
			
			//now we can bulk require all the packages
			require(list, function() {			
				callback();
			});
		});
		
		return this;
	};
	
	/**
	 * Set paths
	 *
	 * @return this
	 */
	this.setLoader = function(callback) {
		callback = callback || $.noop;
		
		require.config({
			paths: { text: '/eve/require/text' },
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
		
		callback();
		
		return this;
	};
	
	/**
	 * Set paths
	 *
	 * @return this
	 */
	this.setPaths = function(callback) {
		callback = callback || $.noop;
		
		this.path('root'	, '/application')
			.path('config'	, '/application/config')
			.path('template', '/application/template')
			.path('package'	, '/application/package');
		
		callback();
		
		return this;
	};
	
	/**
	 * Set settings
	 *
	 * @return this
	 */
	this.setSettings = function(callback) {
		callback = callback || $.noop;
		
		var args = Array.prototype.slice.apply(arguments);
		
		//get settings
		return this.config('settings', function(settings) {
			__settings = settings;
			
			this.getServerUrl = function() {
				return __settings.server.protocol 
				+ '://' + __settings.server.host 
				+ ':'	+ __settings.server.port;
			};
			
			//add it to the base class definitions
			$.eve.base.define({ getServerUrl: this.getServerUrl });
			$.eve.action.define({ getServerUrl: this.getServerUrl });
	
			callback();
		}.bind(this));
	};
	
	/**
	 * Process to start server
	 *
	 * @return this
	 */
	this.startClient = function(callback) {
		callback = callback || $.noop;
		
		//that's all it takes to start the server
		var chops = $.chops();
		
		this.getState = function() {
			return chops.getState();
		};
		
		//add it to the base class definitions
		$.eve.base.define({ getState: this.getState });
		$.eve.action.define({ getState: this.getState });
		
		this.trigger('request', [window.location.href, this.getState()]);
		
		callback();
		
		return this;
	};
	
	/* Protected Methods
	-------------------------------*/
	/* Private Methods
	-------------------------------*/
}).singleton();