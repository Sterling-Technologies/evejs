module.exports = function($) {
	return this.define(function(public) {
		/* Constants
		-------------------------------*/
		/* Public Properties
		-------------------------------*/
		public.id 		= 'me';
		public.post 	= {};
		
		/* Private Properties
		-------------------------------*/
		/* Loader
		-------------------------------*/
		public.__load = function(token, url) {
			return new this(token, url);
		};
		
		/* Construct
		-------------------------------*/
		public.__construct = function(token, url) {
			this.token 	= token;
			this.post 	= { link: url };
			this.graph 	= $.load('facebook/graph', this.token);
		};
		
		/* Public Methods
		-------------------------------*/
		/**
		 * sends the post to facebook
		 *
		 * @return this
		 */
		public.create = function(callback) {
			//get the facebook graph url
			this.graph.setId(this.id)
				.useAuthentication()
				.setConnection('links')
				.setData(this.post)
				.send(callback);
			
			return this;
		};
		
		/**
		 * Sets a picture caption
		 *
		 * @param string
		 * @return this
		 */
		public.setCaption = function(caption) {
			this.post.caption = caption;
			return this;
		};
		
		/**
		 * Sets description
		 *
		 * @param string
		 * @return this
		 */
		public.setDescription = function(description) {
			this.post.description = description;
			return this;
		};
		
		/**
		 * Set the profile id
		 *
		 * @param int|string
		 * @return this
		 */
		public.setId = function(id) {
			this.id = id;
			return this;
		};
		
		/**
		 * Sets the link title
		 *
		 * @param string
		 * @return this
		 */
		public.setName = function(name) {
			this.post.name = name;
			return this;
		};
		
		/**
		 * Sets a picture
		 *
		 * @param string
		 * @return this
		 */
		public.setPicture = function(picture) {
			this.post.picture = picture;
			return this;
		};
	
		/* Private Methods
		-------------------------------*/
	});
};