jQuery(function($) {
	require([
		'text!/template/_page.html',
		'text!/template/_head.html',
		'text!/template/_foot.html',
		'text!/template/_menu.html',
		'text!/template/_alert.html',
		'text!/template/_crumbs.html'], 
		function(page, head, foot, menu, alert, crumbs) {
			head = Mustache.render(head, { right: false });
			
			var page = Mustache.render(page, {
				header		: 'Header 1',
				subheader	: 'Subheader',
				
				head		: head,
				body		: '<h1>Some Body</h1>',
				foot		: foot,
				
				crumbs: [{
					path	: '#',
					label	: 'Item 1'
				}, {
					icon	: 'facebook',
					path	: '#',
					label	: 'Item 1'
				}, {
					label	: 'Item 1'
				}],
				
				menu: [{
					active	: true,
					path	: '#',
					icon	: 'pencil',
					label	: 'Item 1',
					children: [{
						active	: true,
						path	: '#',
						icon	: 'pencil',
						label	: 'Item 1',
						children: [{
									active	: true,
								path	: '#',
								icon	: 'pencil',
								label	: 'Item 1' 
							}, {
								active	: false,
								path	: '#',
								icon	: 'pencil',
								label	: 'Item 2' 
							}]
						}, {
							active	: false,
							path	: '#',
							icon	: 'pencil',
							label	: 'Item 1' 
						}]
					}, {
						active	: false,
						path	: '#',
						icon	: 'pencil',
						label	: 'Item 1'
				}],
				
				messages: [{
					type	: 'error',
					message	: 'okay',
					icon	: 'ok'
				}, {
					type	: 'success',
					message	: 'okay',
					icon	: 'facebook'
				}],
				
			}, {
				menu	: menu,
				alert	: alert,
				crumbs	: crumbs 
			});
			
			$(document.body).html(page);
		});
	
	
});