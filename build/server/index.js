/*
 * This file is part a custom application package.
 * (c) 2014-2015 Openovate Labs
 */

/* Get Application
-------------------------------*/
require('./controller')

/* Set Paths
-------------------------------*/
.setPaths()

/* Start Packages
-------------------------------*/
.startPackages()

/* Trigger Init Event
-------------------------------*/
.trigger('init')

/* Set Database
-------------------------------*/
.setDatabases()

/* Trigger Database Event
-------------------------------*/
.trigger('database')

/* Start Server
-------------------------------*/
.startServer()

/* Trigger Start Event
-------------------------------*/
.trigger('start');