import API from "../../helpers/api"

// constants
import { LOG_OUT } from './auth'
const CREATED_SHOPPING_CART_WITH_PRODUCT_DB = 'CREATED_SHOPPING_CART_WITH_PRODUCT_DB'
const ADDED_PRODUCT_TO_SHOPPING_CART = 'ADDED_PRODUCT_TO_SHOPPING_CART'
const FETCHED_GROUP_SHOPPING_CARTS = 'FETCHED_GROUP_SHOPPING_CARTS'
export const MARKED_SHOPING_CART_PRODUCT_AS_SOLD = 'MARKED_SHOPING_CART_PRODUCT_AS_SOLD'

import { markedProductAsSoldProductsView } from './products'

function copyObject(item){
    return JSON.parse(JSON.stringify(item))
}

export const createdShoppingCartWithProductDb = (shoppingCarts)=>({
    type: CREATED_SHOPPING_CART_WITH_PRODUCT_DB,
    shoppingCarts
})

export const addedProductToShoppingCart = (product, groupId)=>({
    type: ADDED_PRODUCT_TO_SHOPPING_CART,
    product,
    groupId
})

export const fetchedShoppingCart = (shoppingCarts)=>({
    type: FETCHED_GROUP_SHOPPING_CARTS,
    shoppingCarts
})

const markedProductAsSold = (productId)=>({
    type: MARKED_SHOPING_CART_PRODUCT_AS_SOLD,
    productId
})

// thunks
export const createShoppingCartWithProductDb = (groupId, sellerId, productId)=>{
    return async (dispatch)=>{
        const { data: shoppingCarts } = await API({method: 'post', body: { groupId, sellerId, productId}, url: '/api/shoppingcart/creategroup'})
        dispatch(createdShoppingCartWithProductDb(shoppingCarts))
    }
}

export const addProductToShoppingCart = (groupId, productId)=>{
    return async (dispatch)=>{
        const { data: product }  = await API({ method: 'post', body:{ groupId, productId }, url: '/api/shoppingcart/addproduct'})
        dispatch(addedProductToShoppingCart(product, groupId))
    }
}

export const fetchShoppingCart = ()=>{
    return async (dispatch)=>{
        const { data } = await API({ method: 'get', url: '/api/shoppingcart'})
        dispatch(fetchedShoppingCart(data))
    }
}

export const markeProductAsSold = ({ productId, purchaserUserId })=>{
    return async (dispatch)=>{
        const { status, product } = await API({ method:'put', url:"/api/products/sell", body: { productId, purchaserUserId }})
        if (status === 200) {
            dispatch(markedProductAsSold(productId))
            dispatch(markedProductAsSoldProductsView(productId))
        }
    }
}

const initState = {
    shoppingCarts: [], // [ { groupId, products: [] } ]
}

export default function Messages(state = initState, action) {
    console.log('dispatch: ', action.type, '\n')
    switch (action.type){
        case FETCHED_GROUP_SHOPPING_CARTS:{
            return { ...state, shoppingCarts: action.shoppingCarts }
        }
        case CREATED_SHOPPING_CART_WITH_PRODUCT_DB:{
            return { ...state, shoppingCarts: action.shoppingCarts }
        }
        case ADDED_PRODUCT_TO_SHOPPING_CART:{
            const { groupId, product } = action
            const copyshoppingCarts = copyObject(state.shoppingCarts)
            const newMessagesList = copyshoppingCarts.reduce((a,c)=>{
                if (c.id === groupId) c.products.push(product) // add new product to messages
                a.push(c)
                return a
            },[])
            return { ...state, shoppingCarts: newMessagesList}
        }
        case MARKED_SHOPING_CART_PRODUCT_AS_SOLD:{
            const copyshoppingCarts = copyObject(state.shoppingCarts)
            const updatedCart = copyshoppingCarts.map(x=>{
                const needUpdate = x.products.find(y=>y.id===action.productId)
                if (needUpdate) needUpdate.sold = true
                return x
            })
            return { ...state, shoppingCarts: updatedCart}
        }
        case LOG_OUT:
            return initState
        default:
            return state;
    }
}
