I liked this concept from [Sebastien Lorber's discussion of Sagas](https://stackoverflow.com/questions/34570758/why-do-we-need-middleware-for-async-flow-in-redux/34623840#34623840):

We need to remember to fire declarative (past-tensed) events rather than imperative actions. They are much easier to test, as the component only needs to know that an event has happened. (e.g. fire 'USER_LOADED' rather than 'LOAD_USER')
