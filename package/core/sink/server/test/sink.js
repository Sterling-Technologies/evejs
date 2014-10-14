var assert 	= require('assert');
var eden 	= require('edenjs');

var server = 'http://server.eve.dev:8082/sink';  

describe('Sink Test Suite', function() {
	describe('Server Tests', function() {
		it('should create a new row', function(done) {
			eden()
				.Rest(server)
				.setMethod('post')
				.setBody(eden().Hash().toQuery({
					sink_title	: 'Some Title',
					sink_slug	: 'some-title-' + Math.random(),
					sink_detail	: 'Some Title'
				}))
				.getResponse(function(error, response) {
					response = eden().String().toHash(response);
					assert.equal(true, response.results > 0);
					assert.equal(false, response.error);
					done();   
				});
		});
		
		it('should update rows', function(done) {
			eden()
				.Rest(server+'/1')
				.setMethod('put')
				.setBody(eden().Hash().toQuery({
					sink_title	: 'Some Title2',
					sink_detail	: 'Some Detail 2'
				}))
				.getResponse(function(error, response) {
					response = eden().String().toHash(response);
					assert.equal(false, response.error);
					done();   
				});
		});
		
		it('should get a list', function(done) {
			eden()
				.Rest(server)
				.getResponse(function(error, response) {
					response = eden().String().toHash(response);
					assert.equal(true, response.results.length > 0); 
					done();   
				});
		});
		
		
		it('should get a detail', function(done) {
			eden()
				.Rest(server+'/1')
				.getResponse(function(error, response) {
					response = eden().String().toHash(response);
					assert.equal('Some Title2', response.results.sink_title); 
					done();   
				});
		});
		
		it('should remove rows', function(done) {
			eden()
				.Rest(server+'/1')
				.setMethod('delete')
				.getResponse(function(error, response) {
					response = eden().String().toHash(response);
					assert.equal(false, response.error);
					done();   
				});
		});
		
		it('should restore rows', function(done) {
			eden()
				.Rest(server+'/restore/1')
				.setMethod('post')
				.getResponse(function(error, response) {
					response = eden().String().toHash(response);
					assert.equal(false, response.error);
					done();   
				});
		});
		
		it('should process a batch process', function(done) {
			eden()
				.Rest(server+'/batch')
				.setMethod('post')  
				.setBody(eden().Hash().toString([
					{ url: '/sink/detail/1' }, 
					{ url: '/sink/list' }, 
					{
						url: '/sink/create',
						data: {
							sink_title	: 'Some Title 5',
							sink_slug	: 'some-title-5-' + Math.random(),
							sink_detail	: 'Some Detail 5'
						}
					}, {
						url: '/sink/update/1',
						data: {
							sink_title	: 'Some Title 6',
							sink_detail	: 'Some Detail 6'
						}
					}
				
				]))
				.getResponse(function(error, response) {
					assert.equal(null, error);
					
					response = eden().String().toHash(response);
					
					for(var i = 0; i < response.length; i++) {
						assert.equal(false, response[i].error);
					}
					
					done();   
				});
		});
	});
});
