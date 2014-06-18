module.exports = function($) {
	return this.define(function(public) {
		/* Public Properties
		-------------------------------*/
		/* Private Properties
		-------------------------------*/
		var _fs 	= require('fs');
		
		/* Loader
		-------------------------------*/
		public.__load = function(path) {
			return new this(path);
		};
		
		/* Construct
		-------------------------------*/
		public.__construct = function(path) {
			//Argument Test
			$.load('argument').test(1, 'string');
				
			this.path = path;
			this.stat = null;
		};
		
		/* Public Methods
		-------------------------------*/
		/**
		 * Copy folder to path
		 * Note: This has to be async
		 *
		 * @param string
		 * @return this
		 */
		public.copy = function(destination, callback) {
			//Argument Test
			$.load('argument')
				.test(1, 'string')
				.test(2, 'function', 'undefined');
			
			//if the file does not exist
			if(!this.isFile()) {
				callback('404 File not found.');
				//do nothing
				return this;
			}
			
			callback 	= callback || $.noop;
			var mode 		= 0755; //this.getPermissions();
			
			var self = this;
			
			//get the parent folder
			var parent = destination.split('/');
			parent.pop();
			parent = parent.join('/');
			
			//make sure the path is created
			$.load('folder', parent).mkdir(mode, function() {
				var read 		= self.getReadStream(),
					write 		= _fs.createWriteStream(destination),
					triggered 	= false;
				
				read.on('error', function(error) {
					if(!triggered) {
						callback(error);
						triggered = true;
					}
				});
				
				write.on('error', function(error) {
					if(!triggered) {
						callback(error);
						triggered = true;
					}
				});
				
				write.on('close', function() {
					if(!triggered) {
						callback();
						triggered = true;
					}
				});
				
				read.pipe(write);	
			});
			
			return this;
		};
		
		/**
		 * Returns the base name of the file
		 *
		 * @return string
		 */
		public.getBase = function() {
			return this.getName().split('.')[0];
		};
		
		/**
		 * Returns file content
		 *
		 * @param function
		 * @param string
		 * @return string|this|null
		 */
		public.getContent = function(callback, encoding) {
			//Argument Test
			$.load('argument')
				.test(1, 'function', 'undefined')
				.test(2, 'string', 'null', 'undefined');
				
			callback = callback || $.noop;
			encoding = encoding || null;
			
			if(!this.isFile()) {
				callback('404 Not Found', null);
				return this;
			}
			
			_fs.readFile(this.path, encoding, callback);
			return this;
		};
		
		/**
		 * Returns the file extension
		 *
		 * @return string
		 */
		public.getExtension = function() {
			return this.getName().split('.')[1];
		};
		
		/**
		 * Returns file mime type
		 *
		 * @return string
		 */
		public.getMime = function() {
			var extension = this.getExtension() || 'exe';
			
			return _mimeTypes[this.getExtension()] 
			? _mimeTypes[this.getExtension()] 
			: 'application/octet-stream';
		};
		
		/**
		 * Returns the folder path
		 *
		 * @return string
		 */
		public.getParent = function(index) {
			//Argument Test
			$.load('argument').test(1, 'int', 'undefined');
			
			index = index || 0;
			
			var i = 0, pathArray = this.path.split('/');
			
			do {
				pathArray.pop();
				i++;
			} while(i < index);
			
			return pathArray.join('/');
		};
		
		/**
		 * Returns just the file name
		 *
		 * @return string
		 */
		public.getName = function() {
			return this.path.split('/').pop();
		};
		
		/**
		 * Returns numeric permissions
		 *
		 * @return number
		 */
		public.getPermissions = function() {
			try {
				//return _getStat.call(this).mode;
				return parseInt((_getStat.call(this).mode & parseInt ("777", 8)).toString(8));
				
			} catch(e) {}
			
			return 0;
		};
		
		/**
		 * Returns the file size in bytes
		 *
		 * @return number
		 */
		public.getSize = function() {
			try {
				return _getStat.call(this).size;
			} catch(e) {}
			
			return 0;
		};
		
		/**
		 * Returns the read stream if you want to 
		 * do more advance things
		 *
		 * @return resource
		 */
		public.getReadStream = function() {
			return _fs.createReadStream(this.path);
		};
		
		/**
		 * Returns the write stream if you want to 
		 * do more advance things
		 *
		 * @return resource
		 */
		public.getWriteStream = function() {
			return _fs.createWriteStream(this.path);
		};
		
		/**
		 * Returns the last updated time in unix format
		 *
		 * @return number
		 */
		public.getTime = function() {
			try {
				return _getStat.call(this).mtime.getTime();
			} catch(e) {}
			
			return 0;
		};
		
		/**
		 * Returns true if the file is a real file in the system
		 *
		 * @return bool
		 */
		public.isFile = function() {
			try {
				return _getStat.call(this).isFile();
			} catch (e) {}
			
			return false;
		};
		
		/**
		 * Sets the content of the file
		 *
		 * @param string
		 * @param function|true
		 * @return this
		 */
		public.setContent = function(content, callback) {
			//Argument Test
			$.load('argument')
				.test(1, 'string', 'numeric')
				.test(2, 'function', 'undefined');
				
			callback = callback || $.noop;
			
			var self = this, folder = $.load('folder', this.getParent());
			
			//if the folder does not exist ? 
			if(!folder.isFolder()) {
				//make the folder
				folder.mkdir(null, function() {
					_fs.writeFile(self.path, content, callback);		
				});
				
				return this;
			}
			
			_fs.writeFile(this.path, content, callback);
			return this;
		};
		
		/**
		 * Removes the file
		 *
		 * @return this
		 */
		public.remove = function(callback) {
			//Argument Test
			$.load('argument').test(1, 'function', 'undefined');
				
			callback = callback || $.noop;
			_fs.unlink(this.path, callback);
			return this;
		};
		
		/* Private Methods
		-------------------------------*/
		var _getStat = function() {
			if(!this.stat) {
				this.stat = _fs.lstatSync(this.path);
			}
			
			return this.stat;
		};
		
		/* Large Data
		-------------------------------*/
		var _mimeTypes = {
			ai 			: 'application/postscript',	    	aif 		: 'audio/x-aiff',
			aifc 		: 'audio/x-aiff',					aiff 		: 'audio/x-aiff',
			asc 		: 'text/plain',				    	atom 		: 'application/atom+xml',
			au 			: 'audio/basic',				    avi 		: 'video/x-msvideo',
			bcpio 		: 'application/x-bcpio',		    bin 		: 'application/octet-stream',
			bmp 		: 'image/bmp',					    cdf 		: 'application/x-netcdf',
			cgm 		: 'image/cgm',					    class 		: 'application/octet-stream',
			cpio 		: 'application/x-cpio',		    	cpt 		: 'application/mac-compactpro',
			csh 		: 'application/x-csh',			    css 		: 'text/css',
			dcr 		: 'application/x-director',	    	dif 		: 'video/x-dv',
			dir 		: 'application/x-director',	    	djv 		: 'image/vnd.djvu',
			djvu 		: 'image/vnd.djvu',			    	dll 		: 'application/octet-stream',
			dmg 		: 'application/octet-stream',	    dms 		: 'application/octet-stream',
			doc 		: 'application/msword',		    	dtd 		: 'application/xml-dtd',
			dv 			: 'video/x-dv',				    	dvi 		: 'application/x-dvi',
			dxr 		: 'application/x-director',	    	eps 		: 'application/postscript',
			etx 		: 'text/x-setext',				    exe 		: 'application/octet-stream',
			ez 			: 'application/andrew-inset',	    gif 		: 'image/gif',
			gram 		: 'application/srgs',			    grxml 		: 'application/srgs+xml',
			gtar 		: 'application/x-gtar',		    	hdf 		: 'application/x-hdf',
			hqx 		: 'application/mac-binhex40',	    htm 		: 'text/html',
			html 		: 'text/html',					    ice 		: 'x-conference/x-cooltalk',
			ico 		: 'image/x-icon',				    ics 		: 'text/calendar',
			ief 		: 'image/ief',					    ifb 		: 'text/calendar',
			iges 		: 'model/iges',				    	igs 		: 'model/iges',
			jnlp 		: 'application/x-java-jnlp-file',  	jp2 		: 'image/jp2',
			jpe 		: 'image/jpeg',				    	jpeg 		: 'image/jpeg',
			jpg 		: 'image/jpeg',				    	js 			: 'application/x-javascript',
			kar 		: 'audio/midi',				    	latex 		: 'application/x-latex',
			lha 		: 'application/octet-stream',	    lzh 		: 'application/octet-stream',
			m3u 		: 'audio/x-mpegurl',			    m4a 		: 'audio/mp4a-latm',
			m4b 		: 'audio/mp4a-latm',			    m4p 		: 'audio/mp4a-latm',
			m4u 		: 'video/vnd.mpegurl',			    m4v 		: 'video/x-m4v',
			mac 		: 'image/x-macpaint',			    man 		: 'application/x-troff-man',
			mathml 		: 'application/mathml+xml',	    	me 			: 'application/x-troff-me',
			mesh 		: 'model/mesh',				    	mid 		: 'audio/midi',
			midi 		: 'audio/midi',				    	mif 		: 'application/vnd.mif',
			mov 		: 'video/quicktime',			    movie 		: 'video/x-sgi-movie',
			mp2 		: 'audio/mpeg',				    	mp3 		: 'audio/mpeg',
			mp4 		: 'video/mp4',					    mpe 		: 'video/mpeg',
			mpeg 		: 'video/mpeg',				    	mpg 		: 'video/mpeg',
			mpga 		: 'audio/mpeg',				    	ms 			: 'application/x-troff-ms',
			msh 		: 'model/mesh',				    	mxu 		: 'video/vnd.mpegurl',
			nc 			: 'application/x-netcdf',		    oda 		: 'application/oda',
			ogg 		: 'application/ogg',			    pbm 		: 'image/x-portable-bitmap',
			pct 		: 'image/pict',				    	pdb 		: 'chemical/x-pdb',
			pdf 		: 'application/pdf',			    pgm 		: 'image/x-portable-graymap',
			pgn 		: 'application/x-chess-pgn',	    pic 		: 'image/pict',
			pict 		: 'image/pict',				    	png 		: 'image/png',
			pnm 		: 'image/x-portable-anymap',	    pnt 		: 'image/x-macpaint',
			pntg 		: 'image/x-macpaint',			    ppm 		: 'image/x-portable-pixmap',
			ppt 		: 'application/vnd.ms-powerpoint', 	ps 			: 'application/postscript',
			qt 			: 'video/quicktime',			    qti 		: 'image/x-quicktime',
			qtif 		: 'image/x-quicktime',			    ra 			: 'audio/x-pn-realaudio',
			ram 		: 'audio/x-pn-realaudio',		    ras 		: 'image/x-cmu-raster',
			rdf 		: 'application/rdf+xml',		    rgb 		: 'image/x-rgb',
			rm 			: 'application/vnd.rn-realmedia',  	roff 		: 'application/x-troff',
			rtf 		: 'text/rtf',					    rtx 		: 'text/richtext',
			sgm 		: 'text/sgml',					    sgml		: 'text/sgml',
			sh 			: 'application/x-sh',			    shar 		: 'application/x-shar',
			silo 		: 'model/mesh',				    	sit 		: 'application/x-stuffit',
			skd 		: 'application/x-koan',		    	skm 		: 'application/x-koan',
			skp 		: 'application/x-koan',		    	skt 		: 'application/x-koan',
			smi 		: 'application/smil',			    smil 		: 'application/smil',
			snd 		: 'audio/basic',				    so 			: 'application/octet-stream',
			spl 		: 'application/x-futuresplash',    	src 		: 'application/x-wais-source',
			sv4cpio 	: 'application/x-sv4cpio',		    sv4crc 		: 'application/x-sv4crc',
			svg 		: 'image/svg+xml',				    swf 		: 'application/x-shockwave-flash',
			t 			: 'application/x-troff',		    tar 		: 'application/x-tar',
			tcl 		: 'application/x-tcl',			    tex 		: 'application/x-tex',
			texi 		: 'application/x-texinfo',		    texinfo 	: 'application/x-texinfo',
			tif 		: 'image/tiff',				    	tiff 		: 'image/tiff',
			tr 			: 'application/x-troff',		    tsv 		: 'text/tab-separated-values',
			txt 		: 'text/plain',				    	ustar 		: 'application/x-ustar',
			vcd 		: 'application/x-cdlink',		    vrml 		: 'model/vrml',
			vxml 		: 'application/voicexml+xml',	    wav 		: 'audio/x-wav',
			wbmp 		: 'image/vnd.wap.wbmp',		    	wbmxl 		: 'application/vnd.wap.wbxml',
			wml 		: 'text/vnd.wap.wml',			    wmlc 		: 'application/vnd.wap.wmlc',
			wmls 		: 'text/vnd.wap.wmlscript',	    	wmlsc 		: 'application/vnd.wap.wmlscriptc',
			wrl			: 'model/vrml',				    	xbm 		: 'image/x-xbitmap',
			xht 		: 'application/xhtml+xml',		    xhtml 		: 'application/xhtml+xml',
			xls 		: 'application/vnd.ms-excel',	    xml 		: 'application/xml',
			xpm 		: 'image/x-xpixmap',			    xsl 		: 'application/xml',
			xslt 		: 'application/xslt+xml',		    xul 		: 'application/vnd.mozilla.xul+xml',
			xwd 		: 'image/x-xwindowdump',		    xyz 		: 'chemical/x-xyz',
			zip 		: 'application/zip' };
	});
};