define(function() {
	return function(e, request, action) {
		//case for -> a {{from.schema.name}} having only one {{to.schema.name}}
		//create the field to attach a {{to.schema.name}} on {{from.schema.name}} create
		
		//if the path already starts with {{name}}
		if(request.path.indexOf('/{{from.schema.name}}/create/{{name}}/') === 0) {
			//do nothing
			return;
		}
		
		var $ = jQuery;
		
		//add a field
		var body = Handlebars.compile("\{\{#block 'form/fieldset' '{{to.schema.singular}}'\}\}"
		+ "\{\{{block 'field/autocomplete' '' '' ../options "
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
			.parent().append('<input type="hidden" name="{{to.schema.name}}" />');
		});
		
		$('section.{{from.schema.name}}-form div.form-actions').before(body);
	};
});