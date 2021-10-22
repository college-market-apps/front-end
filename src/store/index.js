import { createStore, combineReducers, applyMiddleware } from "redux";
import thunkMiddleware from 'redux-thunk';
import ShoppingCart from './reducers/shoppingcart'
import Products from './reducers/products'
import Likes from './reducers/likes'
import User from './reducers/user'
import Search from "./reducers/search";
import ChatRooms from './reducers/groupMessages'
import Auth from './reducers/auth'
const reducer = combineReducers({
  ShoppingCart,
  Likes,
  User,
  Products,
  Search,
  ChatRooms,
  Auth
});

// const middleware = applyMiddleware(thunkMiddleware);
const middleware = applyMiddleware(thunkMiddleware)
const store = createStore(reducer,middleware);

export default store;

// export const baseUrl = 'http://localhost:/3000'
