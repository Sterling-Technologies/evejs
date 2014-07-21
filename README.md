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
