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
		public.__load = function(token, message) {
			return new this(token, message);
		};
		
		/* Construct
		-------------------------------*/
		public.__construct = function(token, message) {
			this.token 	= token;
			this.post 	= { message: message };
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
				.setConnection('feed')
				.setData(this.post)
				.send(callback);
			
			return this;
		};
		
		/**
		 * Sets media description
		 *
		 * @param string
		 * @return this
		 */
		public.setDescription = function(description) {
			this.post.description = description;
			return this;
		};
		
		/**
		 * Sets anicon for this post
		 *
		 * @param string
		 * @return this
		 */
		public.setIcon = function(url) {
			this.post.icon = url;
			return this;
		};
		
		/**
		 * Sets id for this post
		 *
		 * @param string
		 * @return this
		 */
		public.setId = function(id) {
			this.id = id;
			return this;
		};
		
		/**
		 * sets the link to your post
		 *
		 * @param string
		 * @return this
		 */
		public.setLink = function(url) {
			this.post.link = url;
			return this;
		};
		
		/**
		 * sets the picture to your post
		 *
		 * @param string
		 * @return this
		 */
		public.setPicture = function(url) {
			this.post.picture = url;
			return this;
		};
		
		/**
		 * Sets the title of a post
		 *
		 * @param string
		 * @return this
		 */
		public.setTitle = function(title) {
			this.post.name = title;
			return this;
		};
		
		/**
		 * sets the video to your post
		 *
		 * @param string
		 * @return this
		 */
		public.setVideo = function(url) {
			this.post.video = url;
			return this;	
		};
	
		/* Private Methods
		-------------------------------*/
	});
};