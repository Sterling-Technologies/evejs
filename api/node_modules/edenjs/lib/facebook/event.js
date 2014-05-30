module.exports = function($) {
	return this.define(function(public) {
		/* Constants
		-------------------------------*/
		public.OPEN 	= 'OPEN';
		public.CLOSED 	= 'CLOSED';
		public.SECRET 	= 'SECRET';

		/* Public Properties
		-------------------------------*/
		public.id 		= 'me';
		public.post 	= {};
		public.venue	= {};
		
		/* Private Properties
		-------------------------------*/
		/* Loader
		-------------------------------*/
		public.__load = function(token, name, start, end) {
			return new this(token, name, start, end);
		};
		
		/* Construct
		-------------------------------*/
		public.__construct = function(token, name, start, end) {
			this.token = token;
			this.post 	= {
				name		: name,
				start_time 	: start,
				end_time 	: end };
				
			this.graph = $.load('facebook/graph', this.token);
		};
		
		/* Public Methods
		-------------------------------*/
		/**
		 * sends the post to facebook
		 *
		 * @return this
		 */
		public.create = function(callback) {
			//post variable must be array
			if($.hash.size(this.venue)) {
				this.post.venue = $.hash.toJson(this.venue);
			}
			
			//get the facebook graph url
			this.graph.setId(this.id)
				.useAuthentication()
				.setConnection('events')
				.setData(this.post)
				.send(callback);
			
			return this;
		};
		
		/**
		 * Sets the venue city
		 *
		 * @param string
		 * @return this
		 */
		public.setCity = function(city){
			this.venue.city = city;
			return this;
		};
		
		/**
		 * Sets the venue coordinates
		 *
		 * @param float
		 * @param float
		 * @return this
		 */
		public.setCoordinates = function(latitude, longitude){
			this.venue.latitude = latitude;
			this.venue.longitude = longitude;
			return this;
		};
		
		/**
		 * Sets the venue country
		 *
		 * @param string
		 * @return this
		 */
		public.setCountry = function(country){
			this.venue.country = country;
			return this;
		};
		
		/**
		 * Sets description
		 *
		 * @param string
		 * @return this
		 */
		public.setDescription = function(description){
			this.post.description = description;
			return this;
		};
		
		public.setId = function(id) {
			this.id = id;
			return this;
		};
		
		/**
		 * Sets the title of a post
		 *
		 * @param string
		 * @return this
		 */
		public.setLocation = function(location){
			this.post.location = location;
			return this;
		};
		
		/**
		 * Sets privacy to closed
		 *
		 * @return this
		 */
		public.setPrivacyClosed = function() {
			this.post.privacy = this.CLOSED;
			return this;
		};
		
		/**
		 * Sets privacy to open
		 *
		 * @return this
		 */
		public.setPrivacyOpen = function() {
			this.post.privacy = this.OPEN;
			return this;
		};
		
		/**
		 * Sets privacy to secret
		 *
		 * @return this
		 */
		public.setPrivacySecret = function() {
			this.post.privacy = this.SECRET;
			return this;
		};
		
		/**
		 * Sets the venue state
		 *
		 * @param string
		 * @return this
		 */
		public.setState = function(state){
			this.venue.state = state;
			return this;
		};
		
		/**
		 * Sets the venue street
		 *
		 * @param string
		 * @return this
		 */
		public.setStreet = function(street){
			this.venue.street = street;
			return this;
		};
	
		/* Private Methods
		-------------------------------*/
	});
};