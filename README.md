![Eve Logo](http://openovate.com/eve-logo.png)

  A package management framework for [node](http://nodejs.org).

```
WARNING: Eve is in development and has not passed testing. DO NOT USE IN LIVE ENVIRONMENTS!
```

### Installation

```bash
$ npm install -g evejs
```

## Quick Start

  1. Create a package.json

```
npm init
```

  2. Install an eve build in current directory

```
eve install
```

  This does 2 things. Deploys a build in your specified folder and creates default packages and config in your current directory.

  3. Specify what folder to build the environments
  4. Point Apache to the control and web folders in the build environments you specified.
  5. Watch for changes in the current directory

```
eve watch
```
  6. Use nodemon on the server folder located in your specified build folder.
  
  All changes made in the current directory will be evaluated and redistributed to your build folder.

### Features

  * Event driven packages
  * Built in file watcher
  * Built in JSHint
  * Built in Mocha
  * Built in Scaffolding
  * Pre-defined Core packages (Post, User, Category, File, Auth)
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

#Contibuting to Eve

##Setting up your machine with the Eden repository and your fork

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
6. Someone from our will review your code and merge it in when it has been classified as suitable.
