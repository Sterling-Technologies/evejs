fojo
====

Form Object submission with a JS Object

#### Usage

```
var fojo = jQuery.fojo()
	.setUrl('/sample')
	.setData('user[0][name]', 'Chris')
	.setData('user[0][email]', 'chris@fojo.com')
	
	.on('start', function(e) {
		console.log('Submission Started');
	})
	
	.on('progress', function(e, percent) {
		console.log('Progress '+percent+'%');
	})
	
	.on('abort', function(e) {
		console.log('Submission Aborted');
	})
	
	.on('error', function(e) {
		console.log('Submission Error');
	})
	
	.on('response', function(response) {
		console.log('Submission Complete!');
		console.log(''+response+'');
	});

$('input[type="file"]', this).each(function() {
	//if there is no name to this
	if(!this.name || !this.name.length) {
		//skip it
		return;
	}
	
	fojo.setData(this.name, this.files);
});
	
fojo.send();
```

#### So What Does It Do Again?

Fojo sends form data to server programmatically.

#### So What's It For Again?

It's useful for pushing up files to let's say a Node JS Server. (but you can push to any kind of server)

#### Requires

- jQuery - http://jquery.com/download/
- classified - https://github.com/cblanquera/classified
