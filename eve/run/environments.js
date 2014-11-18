module.exports = function(eve, command, noDeploy) {
	var environments 	= ['admin', 'server', 'web', 'phonegap'],
		root			= eve.getEvePath(),
		build			= eve.getBuildPath(),
		request 		= require('request'),
		fs				= require('fs'),
		tar 			= require('tar'),
		gz 				= require('zlib');
	
	eve
	
	.sync(function(next) {
		next.thread('download', 0);
	})
	
	.thread('download', function(i, next) {
		if(i >= environments.length) {
			next();
			return;
		}
		
		if(!this.Folder(root + '/build').isFolder()) {
			require('fs').mkdirSync(root + '/build');
		}
		
		this.trigger('message', 'Downloading ' + environments[i] + ' environment ...');
		
		var start 	= 'https://raw.githubusercontent.com/Openovate'
					+ '/evejs/master/build/'+environments[i]+'.tar.gz',
			end		= root + '/build',
			
			tmp		= 'tmp-' + Math.floor(Math.random() * 1000),
			step1 	= start,	
			step2 	= end + '/' + tmp + '.tar.gz',
			step3 	= end + '/' + tmp + '.tar',
			step4	= end;
		
		var from = request(step1);
		var to = fs.createWriteStream(step2);
		
		try {
			from.pipe(to);
		} catch(e) {
			this.trigger('error', e.message);
			return;
		}
		
		to.on('close', function() {
			this.trigger('message', 'Extracting Environment ...');
			
			var from = fs.createReadStream(step2);
			var to = fs.createWriteStream(step3);
			
			from.pipe(gz.createGunzip()).pipe(to);
			
			to.on('close', function() {
				var from = fs.createReadStream(step3);
				var to = tar.Extract({ path: step4 });
				
				from.pipe(to);
				to.on('close', function() {
					fs.unlink(step2, function() {
						fs.unlink(step3, function() {
							next.thread('download', i + 1);
						});
					});
				});
			});
		}.bind(this));
	})
	
	//finish up
	.then(function(next) {
		this.trigger('success', 'Environments updated!');	
		next();
	});
};