define(function() {
	return function(e, request, action) {
		var $ = jQuery;
		
		{{#if from.many}}{{else}}
		//case for -> a {{from.schema.name}} having only one {{to.schema.name}}
		//create the field to attach a {{to.schema.name}} on {{from.schema.name}} update
		
		//get related {{to.schema.name}} based on the {{from.schema.name}}
		var {{from.schema.name}} = request.variables[0];
		
		$.getJSON(this.getServerUrl() + '/{{name}}/{{from.schema.name}}/' + {{from.schema.name}}, function(response) { 
			if(response.error) {
				this.notify('Error', error.message, 'error');
				return;
			}
			
			var value 	= '';
			var id 		= '';
			
			if(response.results[0]) {
				value = response.results[0].{{from.reference}};
				id = response.results[0].{{from.schema.primary}};
			}
			
			//add a field
			var body = Handlebars.compile("\{\{#block 'form/fieldset' '{{from.schema.singular}}'\}\}"
			+ "\{\{{block 'field/autocomplete' '' '" + value + "' ../options "
			+ "'placeholder=\"Please enter a {{from.referenceLabel}}\"'\}\}}\{\{/block\}\}")({ 
				options: {
					name : '{{from.schema.singular}}',
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
						url: this.getServerUrl() + '/{{from.schema.name}}?keyword=%QUERY',
						filter: function(data) {
							var results = data.results.map(function (item) {
								return {
									id: item.{{from.schema.primary}},
									value: item.{{from.reference}} };
							});
					
							return results;
						}
					}
				}
			});
			
			body = $(body).on('ready', function() {
				$('input.eve-field-autocomplete', this)
				.on('typeahead:selected', function(e, item) {
					$(this).parent().siblings('input[name="{{from.schema.name}}"]').val(item.id);
				})
				.on('typeahead:autocompleted', function(e, item) {
					$(this).parent().siblings('input[name="{{from.schema.name}}"]').val(item.id);
				})
				.parent().append('<input type="hidden" name="{{from.schema.name}}" value="'+id+'" />');
			});
			
			$('section.{{to.schema.name}}-form div.form-actions').before(body);
			
		}.bind(this));
		{{/if}}
	};
});