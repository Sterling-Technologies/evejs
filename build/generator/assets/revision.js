define(function() {  
    var Definition = function() {
		this.__construct.call(this);
	}, prototype = Definition.prototype;
    
    /* Public Properties 
    -------------------------------*/
    prototype.title        = 'Updating {{singular}} - Revisions';
    prototype.header       = 'Updating {{singular}}';
    prototype.subheader    = 'Revisions';
	
    prototype.crumbs = [{ 
        path: '/{{name}}',
        icon: '{{icon}}', 
        label: '{{plural}}' 
    }, {  label: 'Update {{singular}}' }];
	
    prototype.data     = {};
	
    prototype.template = controller.path('{{name}}/template') + '/revision.html';
    
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
		var id =  window.location.pathname.split('/')[3];
		var url = controller.getServerUrl() + '/{{name}}/detail/'+id;
		
		$.getJSON(url, function(response) {
			this.data.{{name}} = response.results;
			
			if(window.location.pathname.split('/')[4]) {
				var revision = window.location.pathname.split('/')[4];
				
				if(!this.data.{{name}}.revision[revision]) {
					//display message status
					controller.notify('Error', 'Revision does not exist.', 'error');
					next();
					return;
				}
				
				//it exists
				var route = { action: 'update' };
				
				route.path = controller.path('{{name}}/action') + '/' + route.action + '.js';
	
				//event when the {{name}} action is about to render
				controller.trigger('{{name}}-action-' + route.action + '-before', route);
				
				//load up the action
				require([route.path], function(action) {
					action = action.load();
					
					action.data.{{name}} = this.data.{{name}}.revision[revision];
					
					action.render();
					
					//event when the {{name}} action is rendered
					controller.trigger('{{name}}-action-' + route.action + '-after', route);
				}.bind(this));
				
				return;
			}
			
			next();
		}.bind(this));
    };
    
    var _output = function(next) {
		//store form templates path to array
        var templates = ['text!' + this.template];
		
		//CONTROL CONVERT
		//NOTE: BULK GENERATE
		var revisions = this.data.{{name}}.revision;
		if(revisions instanceof Array) {
			for(var i = 0; i < revisions.length; i++) {
				{{#loop fields ~}}
				{{~#if value.field ~}}
				{{~#when value.field.[0] '==' 'datetime' ~}}
				if(revisions[i].{{../../key}}) {
					revisions[i].{{../../key}} = _convertToControlDate(revisions[i].{{../../key}});
				}
				
				{{/when~}}
				{{~#when value.field.[0] '==' 'date' ~}}
				if(revisions[i].{{../../key}}) {
					revisions[i].{{../../key}} = _convertToControlDate(revisions[i].{{../../key}}, false, true);
				}
				
				{{/when~}}
				{{~#when value.field.[0] '==' 'time' ~}}
				if(revisions[i].{{../../key}}) {
					revisions[i].{{../../key}} = _convertToControlDate(revisions[i].{{../../key}}, true);
				}
				
				{{/when~}}
				{{~/if~}}
				{{~/loop}}
			}
		}
		
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
			
			// fire this event whenever the update page of {{name}} is available and fully loaded
			controller.trigger('{{name}}-revision-ready');

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
    
    /* Adaptor
    -------------------------------*/
    return Definition; 
});