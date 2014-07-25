define(function() {
    var Definition = function() {
		this.__construct.call(this);
	}, prototype = Definition.prototype;
    
    /* Public Properties 
    -------------------------------*/
    prototype.title        = 'Create {SINGULAR}';
    prototype.header       = 'Create {SINGULAR}';
    prototype.subheader    = 'CRM';
	
    prototype.crumbs = [{ 
        path: '/{SLUG}',
        icon: '{ICON}', 
        label: '{PLURAL}' 
    }, {  label: 'Create {SINGULAR}' }];
	
    prototype.data     = {};
	
    prototype.template = controller.path('{SLUG}/template') + '/form.html';
    
    /* Private Properties
    -------------------------------*/
    var $ = jQuery;
	
    /* Loader
    -------------------------------*/
    prototype.__load = Definition.load = function() {
        return new Definition();
    };
    
    /* Construct
    -------------------------------*/
	prototype.__construct = function() {
		//reset data because of "pass by ref"
		this.data = {};
	};
    
	/* Public Methods
    -------------------------------*/
    prototype.render = function() {
        $.sequence()
			.setScope(this)
        	.then(_setData)
        	.then(_output);
        
        return this;
    };

    /* Private Methods
    -------------------------------*/
    var _setData = function(next) {
		this.data.mode 		= 'create';
		this.data.url 		= window.location.pathname;
		this.data.{SLUG}	= {};
		
		//NOTE: BULK GENERATE
		{DEFAULTS}
		
		var data = controller.getPost();
		
		if(data && data.length) {
			//query to hash
			this.data.{SLUG} = $.queryToHash(data);
			
			if(!_valid.call(this)) {			
				//display message status
				controller.notify('Error', 'There was an error in the form.', 'error');
				
				next();
				
				return;
			}
			
			//we are good to send this up
			_process.call(this, next);
			
			next();
			
			return;
		}
		
        next();
    };
    
    var _output = function(next) {
		//store form templates path to array
        var templates = ['text!' + controller.path('{SLUG}/template') +  '/form.html'];
		
		//ENUMS
		//NOTE: BULK GENERATE
		{ENUMS}
		
		//CONTROL CONVERT
		//NOTE: BULK GENERATE
		{CONTROL_CONVERT}
			
        //require form templates
        //assign it to main form
        require(templates, function(form) {
            //render the body
			var body = Handlebars.compile(form)(this.data);
			
			controller
				.setTitle(this.title)
				.setHeader(this.header)
				.setSubheader(this.subheader)
				.setCrumbs(this.crumbs)
				.setBody(body);            
				
			next();
		}.bind(this));
    };
	
	var _valid = function() {
		//clear errors
		this.data.errors = {};
		
		//VALIDATION
		//NOTE: BULK GENERATE
		{VALIDATION}
		//if we have no errors
		return JSON.stringify(this.data.errors) === '{}';
	};
	
	var _process = function(next) {
		var url = controller.getServerUrl() + '/{SLUG}/create';
		
		//SERVER CONVERT
		//NOTE: BULK GENERATE
		{SERVER_CONVERT}
		
		//save data to database
		$.post(url, this.data.{SLUG}, function(response) {
			response = JSON.parse(response);
			
			if(!response.error) {		
				controller				
					//display message status
					.notify('Success', '{SINGULAR} successfully created!', 'success')
					//go to listing
					.redirect('/{SLUG}');
				
				//no need to next since we are redirecting out
				return;
			}
			
			this.data.errors = response.validation || {};
			
			//display message status
			controller.notify('Error', 'There was an error in the form.', 'error');
			
			next();
	   }.bind(this));
	};
	
	var _convertToControlDate = function(string, noDate, noTime) {
		if(typeof string !== 'number') {
			string = '' + string;
			if(!string || !string.length) {
				return '';
			}
		}
		
		var date 	= new Date(string);
		var month 	= (date.getMonth() + 1) + '';
		var day 	= date.getDate() + '';
		var year 	= date.getFullYear();	
		
		var hour 	= date.getHours() + '';
		var minute = date.getMinutes() + '';
		
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
		
		date = month + '/' + day + '/' + year;
		var time = hour + ':' + minute;
		
		if(noDate) {
			return time;
		}
		
		if(noTime) {
			return date;
		}
		
		return date + ' ' + time;
	};
	
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
    return Definition; 
});