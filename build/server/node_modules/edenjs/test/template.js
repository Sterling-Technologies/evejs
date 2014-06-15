!function($) {
	var eden = require('../lib/index.js');
	var unit = eden().get('unit');
	var test = unit.extend(function(public) {
		/* Public Properties
		-------------------------------*/
		public.TEST = 'Testing Templating Engine';
	
		/* Private Properties
		-------------------------------*/
		/* Loader
		-------------------------------*/
		public.__load = function() {
			return new this();
		};
		
		/* Construct
		-------------------------------*/
		/* Public Methods
		-------------------------------*/
		public.testTemplate = function(next) {
			var template = '<h1>{store/}</h1>\n<h2>{$slogan}</h2>\n{products}\n<h3>'
			+'{title/}</h3>\n{detail}\n<p>{description/}</p>\n{/detail}\n{/products}';
			
			var output = eden('template')
				.setData({
					store: 'STORE TITLE',
					products: [
						{ title: 'Product 1',
						detail: { description: 'Something about this Product' }},
						{ title: 'Product 2',
						detail: { description: 'Something about this Product' }},
						{ title: 'Product 3',
						detail: { description: 'Something about this Product' }}]
				})
				.setCallback(function(variable, type, args) {
					if(variable == 'slogan') {
						return 'works';
					}
				})
				.render(template);
			
			var same = '<h1>STORE TITLE</h1>\n<h2>works</h2>\n\n<h3>Product 1</h3>'
			+'\n\n<p>Something about this Product</p>\n\n\n<h3>Product 2</h3>'
			+'\n\n<p>Something about this Product</p>\n\n\n<h3>Product 3</h3>'
			+'\n\n<p>Something about this Product</p>\n\n';
			
			this.assertSame(output, same, this.TEST);
			
			next();
		};
		
		/* Private Methods
		-------------------------------*/
	});
	
	unit.cli.call(test, 'template');
}();