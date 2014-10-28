define(function() {
	return function(e, request, action) {
		var $ = jQuery;
		
		{{#if to.many}}{{else}}
		//case for -> a {{from.schema.name}} having only one {{to.schema.name}}
		//create the field to attach a {{to.schema.name}} on {{from.schema.name}} update
		
		//get related {{to.schema.name}} based on the {{from.schema.name}}
		var {{from.schema.name}} = request.variables[0];
		
		$.getJSON(this.getServerUrl() + '/{{name}}/{{to.schema.name}}/' + {{from.schema.name}}, function(response) { 
			if(response.error) {
				this.notify('Error', error.message, 'error');
				return;
			}
			
			var value 	= '';
			var id 		= '';
			
			if(response.results[0]) {
				value = response.results[0].{{to.reference}};
				id = response.results[0].{{to.schema.primary}};
			}
			
			//add a field
			var body = Handlebars.compile("\{\{#block 'form/fieldset' '{{to.schema.singular}}'\}\}"
			+ "\{\{{block 'field/autocomplete' '' '" + value + "' ../options "
			+ "'placeholder=\"Please enter a {{to.referenceLabel}}\"'\}\}}\{\{/block\}\}")({ 
				options: {
					name : '{{to.schema.name}}',
					template: '\{\{value\}\} <strong>( ID: \{\{id\}\} )</strong>',
					engine: {
						compile: function(template) {
							return {
								render: function(context) {
									return Handlebars.compile(template)(context);
								}
							};
						} 
						 
					},
					remote : {
						url: this.getServerUrl() + '/{{to.schema.name}}?keyword=%QUERY',
						filter: function(data) {
							var results = data.results.map(function (item) {
								return {
									id: item.{{to.schema.primary}},
									value: item.{{to.reference}} };
							});
					
							return results;
						}
					}
				}
			});
			
			body = $(body).on('ready', function() {
				$('input.eve-field-autocomplete', this)
				.on('typeahead:selected', function(e, item) {
					$(this).parent().siblings('input[name="{{to.schema.name}}"]').val(item.id);
				})
				.on('typeahead:autocompleted', function(e, item) {
					$(this).parent().siblings('input[name="{{to.schema.name}}"]').val(item.id);
				})
				.parent().append('<input type="hidden" name="{{to.schema.name}}" value="'+id+'" />');
			});
			
			$('section.{{from.schema.name}}-form div.form-actions').before(body);
			
		}.bind(this));
		{{/if}}
		
		{{#if to.many}}
		//case for -> a {{from.schema.name}} having many {{to.schema.name}}
		//add a tab to view many {{to.schema.name}}
		
		//create a tab
		var body = Handlebars.compile('<li class="{{name}}-tab\{\{#when ' 
		+ 'url \'startsWith\' \'/{{name}}/{{to.schema.name}}/\'\}\} active\{\{/when\}\}">\
			<a href="/{{name}}/{{to.schema.name}}/\{\{id\}\}">\
				<i class="blue icon-{{to.schema.name}} bigger-125"></i>\
				{{to.schema.plural}}\
			</a>\
		</li>')({ id: request.variables[0], url: request.path });
		
		$('section.{{from.schema.name}}-update ul.nav-tabs').append(body);
		{{/if}}
	};
});