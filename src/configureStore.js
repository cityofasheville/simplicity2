import { createStore } from 'redux';
import reducers from './reducers';

const configureStore = () => (
  createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
);

export default configureStore;

