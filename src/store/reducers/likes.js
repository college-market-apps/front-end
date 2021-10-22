import axios from 'axios'
function copyObject(obj){
    return JSON.parse(JSON.stringify(obj))
}
const baseUrl = 'http://localhost:3000'
import API from '../../helpers/api'
import { LOG_OUT } from './auth'
// connstants
import { MARKED_SHOPING_CART_PRODUCT_AS_SOLD } from './shoppingcart'
const GET_USER_PRODUCT_LIKES = 'GET_USER_PRODUCT_LIKES'
const GET_USER_SERVICE_LIKES = 'GET_USER_SERVICE_LIKES'
const LIKE_A_PRODUCT = 'LIKE_A_PRODUCT'
const UNLIKE_A_PRODUCT = 'UNLIKE_A_PRODUCT'
const LIKE_A_SERVICE = 'LIKE_A_SERVICE'
const UNLIKE_A_SERVICE = 'UNLIKE_A_SERVICE'

// actions
const gotUserProductLikes = (productsLiked)=>{
    return {
        type: GET_USER_PRODUCT_LIKES,
        productsLiked
    }
}

const gotUserServiceLikes = (servicesLiked)=>{
    return {
        type: GET_USER_SERVICE_LIKES,
        servicesLiked
    }
}

const likedAProduct = (product)=>{
    return {
        type:LIKE_A_PRODUCT,
        product
    }
}

const unlikedProduct = (productId)=>{
    return {
        type:UNLIKE_A_PRODUCT,
        productId
    }
}

const likedAService = (service)=>{
    return {
        type:LIKE_A_SERVICE,
        service
    }
}

const unlikedService = (serviceId)=>{
    return {
        type:UNLIKE_A_SERVICE,
        serviceId
    }
}

// thunks
export const getUserProductLikes = ()=>{
    return async (dispatch)=>{
        const {data:productsLiked} = await API({url:'/api/products/likes', method:'get'})
        dispatch(gotUserProductLikes(productsLiked.products))
    }
}

export const likeAProduct = (productId)=>{
    return async (dispatch)=>{
        const {data:product} = await API({method:'put', url:'/api/products/likes/add', body:{productId}})
        dispatch(likedAProduct(product.product))
    }
}

export const removeProductLike = (productId)=>{
    return async(dispatch)=>{
        const {data: product} = await API({method:'put', url:'/api/products/likes/remove', body:{
            productId
        }})
        dispatch(unlikedProduct(productId))
    }
}

export const getUserServiceLikes = ()=>{
    return async (dispatch)=>{
        const {data} = await API({method:'get', url:'/api/services/likes'})
        dispatch(gotUserServiceLikes(data.services))
    }
}

export const likeAService = (serviceId)=>{
    return async (dispatch)=>{
        const {data} = await API({method:'put', url:'/api/services/likes/add', body:{serviceId}})
        dispatch(likedAService(data.service))
    }
}

export const removeServiceLike = (serviceId)=>{
    return async (dispatch)=>{
        const {data} = await API({method:'put', url:'/api/services/likes/remove', body:{serviceId}})
        dispatch(unlikedService(serviceId))
    }
}

const initLikes = {
    services: [],
    products: []
}

export default function Likes(state=initLikes, action){
    switch (action.type) {
        case GET_USER_PRODUCT_LIKES:{
            const oldState = copyObject(state)
            return {
                ...oldState,
                products: action.productsLiked
            }
        }
        case GET_USER_SERVICE_LIKES:{
            const oldServiceLikeState = copyObject(state)
            return {
                ...oldServiceLikeState,
                services: action.servicesLiked
            }
        }
        case LIKE_A_PRODUCT:{
            const oldProducts = state.products || []
            return { ...state , products: [...oldProducts, action.product]}
        }
        case UNLIKE_A_PRODUCT:{
            const oldUnlikedState = copyObject(state)
            const removedProductLikeList = oldUnlikedState.products.filter(x=>x.id !== action.productId)
            return {...oldUnlikedState, products: removedProductLikeList}
        }
        case LIKE_A_SERVICE:{
            const stateCopy = copyObject(state)
            return {...state, services:[...stateCopy.services, action.service]}
        }
        case UNLIKE_A_SERVICE:{
            let {services} = copyObject(state)
            services = services.filter(x=>x.id !== action.serviceId)
            return {...state, services}
        }
        case MARKED_SHOPING_CART_PRODUCT_AS_SOLD:{
            const copyLikes = copyObject(state.products)
            const updatedLikes =copyLikes.reduce((a,c)=>{
                if (a.id === action.productId) c.sold = true
                a.push(c)
            },[])
            return { ...state, products: updatedLikes}
        }
        case LOG_OUT:
            return initLikes
        default:
            return state
    }
}
