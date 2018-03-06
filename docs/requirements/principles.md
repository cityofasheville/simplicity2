---
layout: default
---
# Requirements & Getting Started

## Basic requirements
* SimpliCity II is written in React. You will need:
  * Node
  * Webpack
  * Yarn
  * A code editor (Visual Studio Code recommended)

## Getting Started
* Fork the repo and clone locally
* Navigate to the project directory on your machine
* Run "yarn" command in git bash to get all the packages as described by the package.json
* Run "npm start" command to run the app at localhost:3000

## Notes on contributing
* Fork the repo and branch off the development branch. We use this [git branching model](http://nvie.com/posts/a-successful-git-branching-model/)
* General guidlines for [contributing to open source projects](https://opensource.guide/how-to-contribute/#how-to-submit-a-contribution)

## If adapting the code base for your city
* See the companion [simplicity-graphql-server repo](https://github.com/cityofasheville/simplicity-graphql-server) for the API
* To run simplicity-graphql-server or your own API locally during development, you can specificy in an .env file whether or not to USE_LOCAL_API, and edit the graphql.js file to update the API URLs as needed.
* If you wish for mobile users to be able to save the application to their homepage, remember to create your own manifest.json file.
* Remember to update your README's and your package.json files with your information.
