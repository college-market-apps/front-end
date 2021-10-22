import API from '../../helpers/api'
const copyObject = (obj)=>{
    return JSON.parse(JSON.stringify(obj))
}
// const
import { LOG_OUT } from './auth'
import { MARKED_SHOPING_CART_PRODUCT_AS_SOLD } from './shoppingcart'
const GET_USER_SCHOOL_PRODUCTS = 'GET_USER_SCHOOL_PRODUCTS'
const GET_A_PRODUCT = 'GET_A_PRODUCT'
const MARKED_PRODUCT_AS_SOLD = 'MARKED_PRODUCT_AS_SOLD'

// actions
const gotSchoolProducts = (products)=>{
    return {
        type:GET_USER_SCHOOL_PRODUCTS,
        products
    }
}

const gotProduct = (product)=>{
    return {
        type:GET_A_PRODUCT,
        product
    }
}

export const markedProductAsSoldProductsView = (productId)=>{
    return{
        type: MARKED_PRODUCT_AS_SOLD,
        productId
    }
}

// thunks
export const getSchoolProducts = ()=>{
    return async (dispatch)=>{
        const {data}  = await API({ url:'/api/products/byschool'})
        dispatch(gotSchoolProducts(data.products))
    }
}

export const getAProduct = (productId) => {
    return async (dispatch)=>{
        const {data} = await API({method:'get',url:`/api/products/${productId}`})
        dispatch(gotProduct(data))
    }
}

export const postNewProduct = ({images, tags, product})=>{
    return async (dispatch)=>{
        const { data } = API({method:'post', body:{ images, tags, product }, url:'/api/products'})
    }
}

export const postProductWithTagsAndImages = ({ product, imagePaths, tags})=>{
    return async(dispatch)=>{
        const { data } = await API({method:'post', body:{ imagePaths, product, tags }, url:'/api/products'})
        dispatch(gotProduct(data))
    }
}


const initState = {
    products: [],
    sellingProducts: [],
    soldProducts: [],
    purchasedProducts: []
}

export default function Products(state=initState, action){
    switch (action.type) {
        case GET_USER_SCHOOL_PRODUCTS:{
            return { products: action.products }
        }
        case GET_A_PRODUCT:{
            return { products: [action.product, ...state.products] }
        }
        case MARKED_PRODUCT_AS_SOLD:{
            const copyProducts = copyObject(state.products)
            const updatedProducts = copyProducts.reduce((a,c)=>{
                if (c.id === action.productId) c.sold = true
                a.push(c)
                return a
            },[])
            return { ...state, products: updatedProducts }
        }
        case MARKED_SHOPING_CART_PRODUCT_AS_SOLD:{

        }
        case LOG_OUT:
            return initState
        default:
            return state
    }
}
