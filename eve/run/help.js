module.exports = function(eve, command) {
	eve.trigger('success', ' * Commands:');
	eve.trigger('success', ' * eve                          - Alias for "eve watch all"');
	eve.trigger('success', ' * sudo eve envronments         - downloads the latest environments');
	eve.trigger('success', ' * eve database                 - Adds a database to build.json');
	//eve.trigger('success', ' * eve install [name]           - installs package from remote');
	//eve.trigger('success', ' * eve update [name]            - installs package from remote');
	eve.trigger('success', ' * eve remove [name]            - removes package from deploys');
	//eve.trigger('success', ' * eve publish [name]           - sends package [name] to remote');
	eve.trigger('success', ' * eve map                      - updates all maps');
	eve.trigger('success', ' * eve create                   - Alias for "eve install all"');
	eve.trigger('success', ' * eve create/web [name]        - Installs web only');
	eve.trigger('success', ' * eve create/admin [name]      - Installs admin only');
	eve.trigger('success', ' * eve create/server [name]     - Installs server only');
	eve.trigger('success', ' * eve create/phonegap [name]   - Installs phonegap only');
	eve.trigger('success', ' * eve deploy                   - deploys entire build to deploy folders');
	eve.trigger('success', ' * eve watch                    - Alias for "eve watch all"');
	eve.trigger('success', ' * eve watch [name]             - Watches changes in [name] only');
	eve.trigger('success', ' * eve generate [name]          - Generates a package given the schema.json'); 
	eve.trigger('success', '                                  in that same folder');
	eve.trigger('success', ' * eve generate [name] [env]    - Generates a package given the schema.json'); 
	eve.trigger('success', '                                  in that same folder only to the');
	eve.trigger('success', '                                  specified environment');
	eve.trigger('success', ' * eve relate [name]            - Generates a relational package given the schema.json');
	eve.trigger('success', '                                  in that same folder');
	
	eve.trigger('complete');
};