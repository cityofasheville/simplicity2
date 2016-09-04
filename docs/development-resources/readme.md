---
layout: default
---
# Development Resources

## Development Principles

We need to remember to fire declarative (past-tensed) events rather than imperative actions. They are much easier to test, as the component only needs to know that an event has happened. (e.g. fire 'USER_LOADED' rather than 'LOAD_USER')

## PostCSS and CSS Modules

[Level Ups Tuts tutorial on PostCSS] (https://www.youtube.com/watch?v=bJShpMC7xFM)

[Chris Keathley at KnoxvilleJS talking about React, PostCSS and CSS Modules](https://www.youtube.com/watch?v=_ie0qJ6bNXQ)

[A really awesome presentation by Mark Dalgleish on The case for CSS modules] (https://www.youtube.com/watch?v=zR1lOuyQEt8)

Helpful examples of CSS Modules: http://andrewhfarmer.com/css-modules-by-example/

## React Apps with Pages

[React Apps with Pages](http://blog.mxstbr.com/2016/01/react-apps-with-pages/)

## Redux-Saga

Full documentation: http://yelouafi.github.io/redux-saga/index.html

[Sebastien Lorber's stack overflow answer to "Why do we need middleware for async flow in Redux?"](https://stackoverflow.com/questions/34570758/why-do-we-need-middleware-for-async-flow-in-redux/34623840#34623840)

## GraphQL

Here’s a really good intro video: https://www.youtube.com/watch?v=Wq02BNrN1dU

And here’s the docs: http://graphql.org/docs/getting-started/

https://medium.com/apollo-stack/graphql-the-next-generation-of-api-design-f24b1689756a#.bk3a14at1


## GIS

### Client-Side GIS

This is a really cool project from the folks at MapBox. It lets you do spatial calculations/queries on the client or in node on GeoJSON through a nice API. It might be useful for occasions when we don’t want to hit the ArcGIS REST API… I’m thinking client side filtering, maybe… maybe not? Just wanted you to know it’s out there.

http://turfjs.org/
