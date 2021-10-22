import axios from 'axios'
import {getToken} from '../../helpers/LocalStorage'
// import {baseUrl} from '../index'
import API, { copyObject } from '../../helpers/api'
// constatns
import { LOG_OUT } from './auth'
import { MARKED_SHOPING_CART_PRODUCT_AS_SOLD } from './shoppingcart'
const GET_USER = 'GET_USER'
const FETCHED_USER_PRODUCTS = 'FETCHED_USER_PRODUCTS'

// actions
const gotUser = (user)=>{
    return {
        type: GET_USER,
        user
    }
}

const fetchedUserProducts = (purchasedProducts=[], userProducts=[])=>{
    return {
        type:FETCHED_USER_PRODUCTS,
        purchasedProducts,
        userProducts
    }
}

// thunks
export const getUser = ()=> {
    return async (dispatch)=>{
        const {data} = await API({url:'/api/users'})
        dispatch(gotUser(data))
    }
}

export const fetchUserProducts = ()=>{
    return async (dispatch)=>{
        const { data} = await API({ url:'/api/users/products', method:'get' })
        const { userProducts, purchasedProducts } = data || { purchasedProducts: [], userProducts: [] }
        dispatch(fetchedUserProducts(purchasedProducts, userProducts))
    }
}

const initUser = {
    user: { uid: null },
    soldProducts: [],
    sellingProducts: [],
    purchasedProducts: []
}


export default function User(state=initUser, action){
    switch (action.type) {
        case GET_USER:
            return {...state, ...action.user}
        case FETCHED_USER_PRODUCTS:{
            let soldProducts = action.userProducts.filter(x=>x.sold) || []
            let sellingProducts = action.userProducts.filter(x=>!x.sold) || []
            let purchasedProducts = action.purchasedProducts || []
            return {
                ...state,
                soldProducts: [...state.soldProducts, ...soldProducts],
                sellingProducts: [...state.sellingProducts, ...sellingProducts],
                purchasedProducts: [...state.purchasedProducts, ...purchasedProducts]
            }
        }
        case LOG_OUT:
            return initUser
        default:
            return state
    }
}
