![Eve Logo](http://openovate.com/eve-logo.png)

  A package management system for [node](http://nodejs.org).

```
WARNING: Eve is in development and has not passed testing. DO NOT USE IN LIVE ENVIRONMENTS!
```

### Installation

```bash
$ npm install -g eve-pms
```

## Quick Start
1 - Install 

```bash
$ eve create
```

2 - Point Apache to deploy/admin

3 - Point Apache to deploy/web

4 - Watch the folder 

```bash
$ eve
```

### Features

  * Event driven packages
  * Built in file watcher
  * Built in JSHint
  * Built in Mocha
  * Built in Scaffolding0
  * Pre-defined admin layout
  * Pre-defined form field and UI blocks
  * Handlebars templating
  * RESTable/OAUTH2
  * Loose definition of packages
  * Socket IO ready

## Why ?

  Mainly used to address a problem we had at [Openovate Labs](http://openovate.com). I needed a library to 
  address end-to-end package reusage. Why build the same register/login form over and over for different 
  projects ? Why do admin interfaces need to look different from each other ? Why does testing need to change
  across projects ? (Not the actual test files...) 

## Packages

  Packages in Eve are different from npm packages. Packages in Eve are more like mini apps in your project that 
  surround a particular object like a post. A post package in Eve is plug and play with the REST, admin and general front
  end usage pre built in. Packages in Eve should be developed as independant from each other as best as possible.

### Generating a Package
1. As an example copy the [post folder in schema](https://github.com/Openovate/evejs/tree/master/schemas/post) to the package folder.
2. In terminal type `eve generate post`
3. In terminal type `eve`
4. In your browser go to `[YOUR ADMIN URL]/post`

### Generating a Relation
1. As an example copy the [post folder in schema](https://github.com/Openovate/evejs/tree/master/schemas/post) to the package folder.
2. Also copy the [user folder in schema](https://github.com/Openovate/evejs/tree/master/schemas/user) to package folder.
3. Also copy the [post_user folder in schema](https://github.com/Openovate/evejs/tree/master/schemas/post_user) to the package folder.
4. In terminal type `eve generate post_user`
5. In terminal type `eve generate post`
6. In terminal type `eve generate user`
7. In terminal type `eve`
8. In your browser go to `[YOUR ADMIN URL]/post/update/1` you should see a tab called *Users*

#Contibuting to Eve

##Setting up your machine with the Eve repository and your fork

1. Fork the main Eden repository (https://github.com/Openovate/evejs)
2. Fire up your local terminal and clone the *MAIN EVE REPOSITORY* (git clone git://github.com/Openovate/evejs.git)
3. Add your *FORKED EDEN REPOSITORY* as a remote (git remote add fork git@github.com:*github_username*/evejs.git)

##Making pull requests

1. Before anything, make sure to update the *MAIN EVE REPOSITORY*. (git checkout master; git pull origin master)
2. Once updated with the latest code, create a new branch with a branch name describing what your changes are (git checkout -b bugfix/fix-server-post)
    Possible types:
    - bugfix
    - feature
    - improvement
3. Make your code changes. Always make sure to sign-off (-s) on all commits made (git commit -s -m "Commit message")
4. Once you've committed all the code to this branch, push the branch to your *FORKED EVE REPOSITORY* (git push fork bugfix/fix-server-post)
5. Go back to your *FORKED EVE REPOSITORY* on GitHub and submit a pull request.
6. Someone from our team will review your code and merge it in when it has been classified as suitable.
