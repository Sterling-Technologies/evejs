/*
 * This file is part a custom application package.
 * (c) 2014-2015 Openovate Labs
 */
jQuery(function($) {
	/* Start Sequence
	-------------------------------*/
	$.sequence().setScope(controller)
	
	/* Set Loader
	-------------------------------*/
	.then(controller.setLoader)
	
	/* Set Paths
	-------------------------------*/
	.then(controller.setPaths)
	
	/* Set Settings
	-------------------------------*/
	.then(controller.setSettings)
	
	/* Trigger Init Event
	-------------------------------*/
	.then(controller.sequenceTrigger, 'config')
	
	/* Start Packages
	-------------------------------*/
	.then(controller.startPackages)
	
	/* Trigger Init Event
	-------------------------------*/
	.then(controller.sequenceTrigger, 'init')
	
	/* Set Template Engine
	-------------------------------*/
	.then(controller.setTemplateEngine)
	
	/* Trigger Template Engine
	-------------------------------*/
	.then(controller.sequenceTrigger, 'engine')
	
	/* Render Page
	-------------------------------*/
	.then(controller.renderPage)
	
	/* Trigger Render Page
	-------------------------------*/
	.then(controller.sequenceTrigger, 'page')
	
	/* Start Client
	-------------------------------*/
	.then(controller.startClient)
	
	/* Trigger Start
	-------------------------------*/
	.then(controller.sequenceTrigger, 'start');
});