jQuery.fn.extend({combobox: function(options) {
	this.each(function() {
		var open 	= false;
		var input 	= jQuery('input', this).typeahead(options);
		var trigger = jQuery('span.input-group-addon', this);
		
		trigger.click(function() {
			if(open) {
				open = false;
				input.data('ttView').dropdownView.close();
				return;
			}
			
			var datasets = input.data('ttView').datasets;
				
			jQuery.each(datasets, function(i, dataset) {
				var suggestions = [];
				jQuery.each(dataset.itemHash, function(i, item) {
					var clone = {};
					jQuery.extend(clone, {dataset: dataset.name}, item);
					suggestions.push(clone);
				});
				
				input.data('ttView').dropdownView.renderSuggestions(dataset, suggestions);
			});
			
			open = true;
			input.data('ttView').dropdownView.open();
		});
	});
	
	return this;
}});