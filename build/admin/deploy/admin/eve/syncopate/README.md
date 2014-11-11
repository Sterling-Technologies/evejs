#Syncopate

  Turn async to sync in JS

### Installation

```bash
$ npm install syncopate
```

## Quick Start

```
var sync = require('syncopate');

var TestClass = function() {
	this.foo 	= 'bar';
	this.steps 	= [];
};

var test = new TestClass();

sync()
//sets the scope for this
.scope(test)
//step 1
.then(function(next) {
	setTimeout(function() {
		this.steps.push('step1');
		next(1);
	}.bind(this), 1);
//step 2
}).then(function(value, next) {
	setTimeout(function() {
		this.steps.push('step2');
		this.bar = value;
		next();
	}.bind(this), 1);
//step 3
}).then(function(next) {
	setTimeout(function() {
		this.steps.push('step3');
		console.log(this.bar); //--> 1
		console.log(this.foo); //--> 'bar'
		next();
	}.bind(this), 1);
//step 4
}).then(function(next) {
	setTimeout(function() {
		this.steps.push('step4');
		//enter the 'loop' thread
		next.thread('loop', 0);
	}.bind(this), 1);
//store a thread
}).thread('loop', function(i, next) {
	setTimeout(function() {
		if(i == 5) {
			next(23);
			return;
		}
		
		console.log(i < 5); //--> true
		next.thread('loop2', i + 10);
	}.bind(this), 1);
//store another thread
}).thread('loop2', function(i, next) {
	setTimeout(function() {
		console.log(i < 15); //--> true
		this.bar = 3;
		next.thread('loop', (i - 10) + 1);
	}.bind(this), 1);
//step 5
}).then(function(num, next) {
	setTimeout(function() {
		console.log(num); //--> 23
		console.log(test.bar); //--> 3
		console.log(test.steps[0]); //--> 'step1'
		console.log(test.steps[1]); //--> 'step2'
		console.log(test.steps[2]); //--> 'step3'
		console.log(test.steps[3]); //--> 'step4'
		next();
	}.bind(this), 1);
});

```

### Methods

  * scope(object) - Sets the scope for all then and thread callbacks
  * then(function) - Queues the next callback and calls it if nothing is queued
  * thread(string, function) - Stores a callback for later usage

### Why ?

  I realize there are other syncronize libraries like the ones from FutureJS which are more focused extensively on syncronous callbacks. 
  In practice, however I found myself calling nested sequence instances or the syntax just got too confusing for someone else to follow 
  despite my best efforts to keep it clean. While writing this code, for the past monthm I tried so many permutations that worked and 
  didn't work considering loops and dependancies, while keeping the code de-leveled and readable. This is the product of many starbucks 
  sessions.
