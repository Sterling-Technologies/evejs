jQuery('th .checkall').click(function() {
	var self = this;
	setTimeout(function() {
		jQuery('tbody input[type="checkbox"]').each(function() {
			this.checked = self.checked;
		});
	}, 1);
});

jQuery('tbody input[type="checkbox"]').click(function() {
	setTimeout(function() {	
		var allChecked = true;
		jQuery('tbody input[type="checkbox"]').each(function() {
			if(!this.checked) {
				allChecked = false;
			}
		});
		
		jQuery('th .checkall')[0].checked = allChecked;
	}, 1);
});