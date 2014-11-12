var assert 		= require('assert');
var classified 	= require('../classified');

//Sample Root Class
var Root = classified(function() {
	this.SOME_CONSTANT = 'foo';
	
	this.sampleProperty = 4.5;
	
	this.sampleDeepProperty = {
		sample1: 'Hello',
		sample2: [4, 5, 6, 7],
		sample3: {
			bool	: true,
			regex	: /^abc/,
			date	: new Date(),
			string	: String
		}
	};
	
	this.resetList = [];
	this.resetHash = {};
	
	this._sampleProperty = 5.5;
	
	this._sampleDeepProperty = {
		sample1: '_Hello',
		sample2: [8, 9, 0, 1]
	};
	
	this._resetList = [];
	this._resetHash = {};
	
	this.__sampleProperty = 6.5;
	
	this.__sampleDeepProperty = {
		sample1: '__Hello',
		sample2: [12, 13, 14, 15]
	};
	
	this.__resetList = [];
	this.__resetHash = {};
	
	this.___construct = function() {
		this.constructCalled = true;
	};
	
	this.sampleMethod = function() {
		return this.SOME_CONSTANT;
	};
	
	this._sampleMethod = function() {
		return '_bar';
	};
	
	this.__sampleMethod = function() {
		return '__zoo';
	};
	
	this.sampleAccessMethod = function() {
		return this.sampleMethod()
		+ this._sampleMethod()
		+ this.__sampleMethod();
	};
	
	this.samplePersistMethod = function() {
		return ++ this._sampleProperty;
	};
	
	this.samplePersistMethod2 = function() {
		this.__sampleProperty = 'George' + this.__sampleProperty;
		return this.__sampleProperty;
	};
	
	this.setReset1Hash = function(name, value) {
		this._resetHash[name] = value;
		return this;
	};
	
	this.getReset1Hash = function(name) {
		return this._resetHash[name];
	};
	
	this.setReset1Array = function(value) {
		this._resetList.push(value);
		return this;
	};
	
	this.getReset1Array = function(index) {
		return this._resetList[index];
	};
	
	this.setReset2Hash = function(name, value) {
		this.__resetHash[name] = value;
		return this;
	};
	
	this.getReset2Hash = function(name) {
		return this.__resetHash[name];
	};
	
	this.setReset2Array = function(value) {
		this.__resetList.push(value);
		return this;
	};
	
	this.getReset2Array = function(index) {
		return this.__resetList[index];
	};
});

describe('Class Test Suite', function() {
	describe('Basic Building Tests', function() {
		var root = Root.load();
		
		it('should call construct', function() {
			assert.equal(true, root.constructCalled);
		});
		
		it('should align properties correctly', function() {
			assert.equal(4.5, root.sampleProperty);
			assert.equal('Hello', root.sampleDeepProperty.sample1);
			assert.equal(5, root.sampleDeepProperty.sample2[1]);
			assert.equal(true, root.sampleDeepProperty.sample3.bool);
			assert.equal(true, root.sampleDeepProperty.sample3.regex instanceof RegExp);
			assert.equal(true, root.sampleDeepProperty.sample3.date instanceof Date);
			assert.equal(String, root.sampleDeepProperty.sample3.string);
		});
		
		it('should not be able to access protected', function() {
			assert.equal('undefined', typeof root._sampleProperty);
			assert.equal('undefined', typeof root._sampleDeepProperty);
			assert.equal('undefined', typeof root._sampleMethod);
		});
		
		it('should not be able to access private', function() {
			assert.equal('undefined', typeof root.__sampleProperty);
			assert.equal('undefined', typeof root.__sampleDeepProperty);
			assert.equal('undefined', typeof root.__sampleMethod);
		});
		
		it('should be able to access protected and private inside a method', function() {
			assert.equal('foo_bar__zoo', root.sampleAccessMethod());
		});
		
		it('should be able to persist protected and private', function() {
			assert.equal(6.5, root.samplePersistMethod());
			assert.equal(7.5, root.samplePersistMethod());
			assert.equal('George6.5', root.samplePersistMethod2());
			assert.equal('GeorgeGeorge6.5', root.samplePersistMethod2());
		});
		
		it('should patrol constants', function() {
			root.SOME_CONSTANT = 'bar';
			assert.equal('foo', root.sampleMethod());
		});
		
		it('should reset deep properties', function() {
			root.resetHash.sample1 = 'yup';
			root.resetList.push('skip');
			
			root.setReset1Hash('sample', 'score1');
			root.setReset1Array('sample1');
			root.setReset2Hash('sample', 'score2');
			root.setReset2Array('sample2');
			
			var root2 = Root.load();
			
			assert.equal('undefined', typeof root2.resetHash.sample1);
			assert.equal('yup', root.resetHash.sample1);
			
			assert.equal('undefined', typeof root2.resetList[0]);
			assert.equal('skip', root.resetList[0]);
			
			assert.equal('score1', root.getReset1Hash('sample'));
			assert.equal('score2', root.getReset2Hash('sample'));
			
			assert.equal('sample1', root.getReset1Array(0));
			assert.equal('sample2', root.getReset2Array(0));
			
			assert.equal('undefined', typeof root2.getReset1Hash('sample'));
			assert.equal('undefined', typeof root2.getReset2Hash('sample'));
			
			
			assert.equal('undefined', typeof root2.getReset1Array(0));
			assert.equal('undefined', typeof root2.getReset2Array(0));
		});
		
		it('should only be one', function() {
			var single = classified({ x: 1 }).singleton();
			var multiple = classified({ x: 1 });
			
			single().x = 2;
			multiple().x = 3;
			
			assert(2, single().x);
			assert(1, multiple().x);
		});
	});
	
	describe('Inheritance Tests', function() {
		var root = Root.load();
		
		it('should copy constants', function() {
			var child = classified({ SOME_CONSTANT_2: 44.5 }).trait(Root.definition()).load();
			assert.equal('foo', child.SOME_CONSTANT);
		});
		
		it('should call construct', function() {
			var child = classified({}).trait(Root.definition()).load();
			assert.equal(true, child.constructCalled);
		});
		
		it('should be the same as root', function() {
			var child = classified({}).trait(Root.definition()).load();
			assert.equal(child.sampleProperty, root.sampleProperty);
			assert.equal(child.sampleDeepProperty.sample1, root.sampleDeepProperty.sample1);
			assert.equal(child.sampleDeepProperty.sample2[1], root.sampleDeepProperty.sample2[1]);
			assert.equal(child.sampleDeepProperty.sample3.bool, root.sampleDeepProperty.sample3.bool);
			assert.equal(child.sampleDeepProperty.sample3.regex, root.sampleDeepProperty.sample3.regex);
			assert.equal(child.sampleDeepProperty.sample3.date, root.sampleDeepProperty.sample3.date);
			assert.equal(child.sampleDeepProperty.sample3.string, root.sampleDeepProperty.sample3.string);
		});
		
		it('should not change properties of root', function() {
			var child = classified({}).trait(Root.definition()).load();
			
			child.sampleProperty = 5.5;
			child.sampleDeepProperty.sample1 = 'hi';
			child.sampleDeepProperty.sample3.bool = false;
			
			assert.notEqual(child.sampleProperty, root.sampleProperty);
			assert.notEqual(child.sampleDeepProperty.sample1, root.sampleDeepProperty.sample1);
			assert.notEqual(child.sampleDeepProperty.sample3.bool, root.sampleDeepProperty.sample3.bool);
		});
		
		it('should be able to add properties', function() {
			var child = Root.extend({
				childSample: 4
			}).load();
			
			child.sampleProperty = 5.5;
			child.sampleDeepProperty.sample1 = 'hi';
			child.sampleDeepProperty.sample3.bool = false;
			
			assert.equal(4, child.childSample);
			assert.equal('undefined', typeof root.childSample);
		});
		
		it('should be able access parent methods', function() {
			var child = classified({
				sampleMethod: function() {
					this.__test = 1;
					return this.___parent.sampleMethod();
				}
			}).trait(Root.definition()).load();
			
			assert.equal('foo', child.sampleMethod());
			assert.equal(1, child.__test);
		});
		
		it('should be able to freeze and unfreeze data', function(done) {
			var child = classified({
				_sampleProperty: 0,
				
				sampleOutput: function() {
					return this._sampleProperty;
				},
				
				sampleMethod: function(callback) {
					this.___freeze();
					
					setTimeout(function() {
						this._sampleMethod(callback);
					}.bind(this));
				},
				
				_sampleMethod: function(callback) {
					assert.equal(0, this._sampleProperty);
					
					this._sampleProperty = 1;
					this.___unfreeze();
					callback();
				}
			}).trait(Root.definition()).load();
			
			
			child.sampleMethod(function() {
				assert.equal('undefined', typeof child._sampleProperty);
			});
			
			assert.equal(0, child.sampleOutput());
			
			setTimeout(function() {
				assert.equal(1, child.sampleOutput());
				assert.equal('undefined', typeof child.___frozen);
				assert.equal('undefined', typeof child.___freeze);
				assert.equal('undefined', typeof child.___unfreeze);
				done();
			}, 100);
		});
		
		it('should be able access parent protected methods', function() {
			var child = classified({
				sampleMethod: function() {
					return this.___parent._sampleMethod();
				}
			}).trait(Root.definition()).load();
			
			assert.equal('_bar', child.sampleMethod());
		});
		
		it('should not be able access parent private methods', function() {
			var child = classified({
				sampleMethod: function() {
					return typeof this.___parent.__sampleMethod;
				}
			}).trait(Root.definition()).load();
			
			assert.equal('undefined', child.sampleMethod());
		});
		
		it('should not be able to register and access root', function() {
			Root.register('rooty');
			
			var child = classified({
				sampleMethod: function() {
					return typeof this.___parent.__sampleMethod;
				}
			}).trait('rooty').load();
			
			assert.equal('undefined', child.sampleMethod());
		});
	});
	
	describe('Grand Children Tests', function() {
		var Child = Root.extend({
			sampleMethod: function() {
				return this.___parent._sampleMethod();
			}
		});
		
		var Trait = classified({
			_sampleMethod2: function() {
				return this.sampleMethod();
			}
		});
		
		var grand = Child.extend({
			sampleMethod: function() {
				return this.___parent.sampleMethod();
			},
			
			sampleMethod2: function() {
				return this._sampleMethod2();
			}
		}).trait(Trait.definition()).load();
		
		it('should be able access parent protected methods', function() {
			assert.equal('_bar', grand.sampleMethod());
		});
		
		it('should be able access traits', function() {
			assert.equal('_bar', grand.sampleMethod2());
		});
	});
});