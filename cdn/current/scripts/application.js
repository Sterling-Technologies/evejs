jQuery(function($) {
	var application = 'http://cdn.eve.dev/application/';
	var template 	= application + '/template';
	var action 		= application + '/action';
	var api			= 'http://api.eve.dev:8082';
	
	require.config({
	    paths: { text: 'http://cdn.lbc.dev/scripts/text' },
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
	
	var ConsumerCollectionView = Backbone.View.extend({
		el: $('section.body').get(0),
		
		initialize: function() {
			var self = this;
			
			require(
				['text!'+template+'/consumer/index.html'], 
				function(template) {
					//AJAX
					$.getJSON(
					api+'/user', 
					function(response) {	
						var row, list = [];
						
						//if error
						if(response.error) {
							return;
						}
						
						//prepare template variables
						for(var i in response.results) {
							row = {
								name: response.results[i].name,
								email: response.results[i].email, 
								street	: '',	city	: '',
								state	: '',	country	: '',
								postal	: '',	phone: '' };
							
							//have address ?
							if(response.results[i].address.length) {
								row.street = response
								.results[i].address[0].street;
								
								row.city = response
								.results[i].address[0].city;
								
								row.state = response
								.results[i].address[0].state;
								
								row.country = response
								.results[i].address[0].country;
								
								row.postal = response
								.results[i].address[0].postal;
							}
							
							//have phone ?
							if(response.results[i].phone.length) {
								row.phone = response
								.results[i].phone[0].value;
							}
							
							list.push(row);
						}
						
						var html = Mustache.render(template, { list: list });
						$(self.el).html(html);
					});
				});
		}
	});
	
	new (Backbone.Router.extend({
		routes: {  '/': 'initialize' },
	
		initialize: function() {
			new ConsumerCollectionView();
		}
	}));
});