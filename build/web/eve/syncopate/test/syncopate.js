var assert 	= require('assert');
var sync	= require('../syncopate');

var TestClass = function() {
	this.foo 	= 'bar';
	this.steps 	= [];
};

describe('Syncopate Test Suite', function() {
	describe('Next Tests', function() {
		it('should sync methods', function(done) {
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
					assert.equal(1, this.bar);
					assert.equal('bar', this.foo);
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
					
					assert.equal(true, i < 5);
					next.thread('loop2', i + 10);
				}.bind(this), 1);
			//store another thread
			}).thread('loop2', function(i, next) {
				setTimeout(function() {
					assert.equal(true, i < 15);
					this.bar = 3;
					next.thread('loop', (i - 10) + 1);
				}.bind(this), 1);
			//step 5
			}).then(function(num, next) {
				setTimeout(function() {
					assert.equal(23, num);
					assert.equal(3, test.bar);
					assert.equal('step1', test.steps[0]);
					assert.equal('step2', test.steps[1]);
					assert.equal('step3', test.steps[2]);
					assert.equal('step4', test.steps[3]);
					next();
					done();
				}.bind(this), 1);
			});
		});
	});
});