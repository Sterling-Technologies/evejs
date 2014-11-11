Chops
=====

Client HTML5 on Push State

#### Usage

```
chops().on('request', function(e, url, state) {
	switch(state.url) {
		case '/some/path':
			jQuery('h1').html('Welcome to Some Path!');
			break;
		case '/some/path/2':
			jQuery('h1').html('Welcome to Some Path 2!');
			break;
		case '/auth':
			if(state.data.json.user) {
				jQuery('h1').html('Welcome ' + state.data.json.user[0].email);
			}
			break;
	}
});
```

#### So What Does It Do Again?

Chops listens for url requests triggered by a link or form submit. It then captures the url request and processes it locally with HTML5 Push States.

#### So What's It For Again?

It's used as a base to build client side applications.

#### Requires

- jQuery - http://jquery.com/download/
- classified - https://github.com/cblanquera/classified
