!function($) {
	var eden = require('eden');
	var unit = eden().get('unit');
	var test = unit.extend(function(public) {
		/* Public Properties
		-------------------------------*/
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
		public.testGetBase = function() {
			var base = eden('file').load(__dirname+'/assets/file/index.html').getBase();
			this.assertSame('index', base, 'Base Test');
		};
		
		public.testGetContent = function() {
			var content = eden('file', __dirname+'/assets/file/index.html').getContent();
			this.assertSame('This is Index', content, 'Content Test');
		};
		
		public.testGetExtension = function() {
			var ext = eden('file', __dirname+'/assets/file/index.html').getExtension();
			this.assertSame('html', ext, 'Extension Test');
		};
		
		public.testGetFolder = function() {
			var path = eden('file', __dirname).getFolder(1);
			this.assertContains('/eden', path, 'Folder Test');
		};
		
		public.testGetMime = function() {
			var mime = eden('file', __dirname+'/assets/file/index.html').getMime();
			this.assertSame('text/html', mime, 'Mime Test');
		};
		
		public.testGetName = function() {
			var name = eden('file', __dirname+'/assets/file/index.html').getName();
			this.assertSame('index.html', name, 'File Name Test');
		};
		
		public.testGetSize = function() {
			var size = eden('file', __dirname+'/assets/file/index.html').getSize();
			this.assertEquals(13, size, 'File Size Test');
		};
		
		public.testGetReadStream = function() {
			var stream = eden('file', __dirname+'/assets/file/index.html').getReadStream();
			this.assertInternalType('function', stream.pipe, 'Read Stream Test');
		};
		
		public.testGetWriteStream = function() {
			var stream = eden('file', __dirname+'/assets/file/test.txt').getWriteStream();
			stream.end('This is Index');
			this.assertInternalType('function', stream.pipe, 'Write Stream Test');
		};
		
		public.testGetTime = function() {
			var time = eden('file', __dirname+'/assets/file/index.html').getTime()+'';
			
			var now = (new Date).getTime()+'';
			this.assertEquals(now.substr(0, -3), time.substr(0, -3), 'Time Stamp Test');
		};
		
		public.testIsPath = function() {
			var valid = eden('file', __dirname).isPath();
			var invalid = eden('file', __dirname+'/assets/file/> 8index.html').isPath();
			
			this.assertTrue(valid, 'Is Path Valid');
			this.assertFalse(invalid, 'Is Path Invalid');
		};
		
		public.testIsFile = function() {
			var invalid = eden('file', __dirname).isFile();
			var valid = eden('file', __dirname+'/assets/file/index.html').isFile();
			
			this.assertTrue(valid, 'Is File Valid');
			this.assertFalse(invalid, 'Is File Invalid');
		};
		
		public.testIsFolder = function() {
			var valid = eden('file', __dirname).isFolder();
			var invalid = eden('file', __dirname+'/assets/file/index.html').isFolder();
			
			this.assertTrue(valid, 'Is Folder Valid');
			this.assertFalse(invalid, 'Is Folder Invalid');
		};
		
		public.testSetContent = function() {
			var file = eden('file', __dirname+'/assets/file/index2.html').setContent('test');
			this.assertSame('test', file.getContent(), 'Set Content Test');
		};
		
		public.testRemove = function() {
			var invalid = eden('file', __dirname+'/assets/file/index2.html').remove().isFile();
			this.assertFalse(invalid, 'Remove File Test');
		};
		
		/* Private Methods
		-------------------------------*/
	});
	
	unit.cli.call(test, 'file');
}();