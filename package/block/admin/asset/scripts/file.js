(function($) {
	$.fn.extend({
		file: function() {
			var createItem = function(list, i) {
				var name = list[i].fileName || list[i].name;
				var size = list[i].fileSize || list[i].size;
				var type = list[i].fileType || list[i].type;
				
				if(size < 1024) {
					size += 'B';
				} else if(size < 1048576) {
					size = Math.ceil(size / 1024) + 'KB';
				} else if(size < 1073741824) {
					size = Math.ceil(size / 1048576) + 'MB';
				} else {
					size = Math.ceil(size / 1073741824) + 'GB';
				}
				
				if(name.length > 20) {
					name = name.substr(0, 5)+'...'+name.substr(-9);
				}
				
				var item = $('<span class="eve-field-file-item">'+
				'<span class="eve-field-file-label">'+name+'<em>('+size+')</em></span><span class="'+
				'eve-field-file-remove">x</span></span>');
				
				$('span.eve-field-file-remove', item).click(function(e) {
					e.preventDefault();
					e.stopPropagation();
					item.remove();
					delete list[i];
					return false;
				});
				
				return item;
			};
			
			$(this).each(function() {	
				$('input', this).change(function() {
					var list = $(this).next().html('');
					for(var i = 0; i < this.files.length; i++) {
						list.append(createItem(this.files, i));
					}
				}).next().click(function() {
					$(this).prev().click();
				});
			});
		}
	});
})(jQuery);