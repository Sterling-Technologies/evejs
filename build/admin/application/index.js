/*
 * This file is part a custom application package.
 * (c) 2014-2015 Openovate Labs
 */
jQuery.eve.base().Controller()

/* Set Loader
-------------------------------*/
.sync(function(next) {
	this.setLoader(next);
})

/* Set Paths
-------------------------------*/
.then(function(next) {
	this.setPaths(next);
})

/* Set Settings
-------------------------------*/
.then(function(next) {
	this.setSettings(next);
})

/* Trigger Config
-------------------------------*/
.then(function(next) {
	this.trigger('config');
	next();
})

/* Start Packages
-------------------------------*/
.then(function(next) {
	this.startPackages(next);
})

/* Trigger Init
-------------------------------*/
.then(function(next) {
	this.trigger('init');
	next();
})

/* Start Session
-------------------------------*/
.then(function(next) {
	this.startSession(next);
})

/* Trigger Session
-------------------------------*/
.then(function(next) {
	this.trigger('session');
	next();
})

/* Render Page
-------------------------------*/
.then(function(next) {
	this.renderPage(next);
})

/* Trigger Page
-------------------------------*/
.then(function(next) {
	this.trigger('page');
	next();
})

/* Startup the client
-------------------------------*/
.then(function(next) {
	this.startClient(next);
})

/* Trigger Client
-------------------------------*/
.then(function(next) {
	this.trigger('client');
	next();
});