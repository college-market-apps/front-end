import { State } from 'react-native-gesture-handler'
import API from '../../helpers/api'
const copyObject  = (obj)=>{
    return JSON.parse(JSON.stringify(obj))
}
// constants
import { LOG_OUT } from './auth'
const SEARCH_USER  = 'SEARCH_USER'
const SEARCH_PRODUCTS_BY_TAGS = 'SEARCH_PRODUCTS_BY_TAGS'
const ON_CHANGE_SEARCH = 'ON_CHANGE_SEARCH'
const ON_CHANGE_SEARCH_TYPE = 'ON_CHANGE_SEARCH_TYPE'

// actions
const searchedUser = (user)=>{
    return {
        type: SEARCH_USER,
        user
    }
}

const gotProductsByTag = (products)=>({
    type: SEARCH_PRODUCTS_BY_TAGS,
    products
})

export const onChangeSearch = (search)=>({
    type: ON_CHANGE_SEARCH,
    search
})

export const changeSearchType = (searchType)=>({
    type: ON_CHANGE_SEARCH_TYPE,
    searchType
})

// thunks
export const searchUser = (userId)=>{
    return async (dispatch)=>{
        try {
            const {data} = await API({method: 'get', body:{userId},url:`/api/users/search/${userId}`})
            dispatch(searchedUser(data))
            return {loading: 'false-----', data:data}
        } catch (error) {
            // return {loading: false, message:'there was an error retreving this user'}
        }
    }
}

export const searchProductByTag = (tagName)=>{
    return async (dispatch)=>{
        const { data: {products} } = await API({ method: 'get', body:{ tagName: 'iphone' }, url: `/api/products/tags/search/${tagName}`})
        dispatch(gotProductsByTag(products))
    }
}

const initState = {
    users:[],
    products: [],
    search:'',
    searchType: 'Tags'
}

export default function Search(state=initState, action){
    switch (action.type) {
        case SEARCH_USER:{
            const searchUserState = copyObject(state)
            const searchUserExist = searchUserState.users.find(x=>x.id === action.user.id)
            if (searchUserExist)return searchUserState
            const {users} = searchUserState
            return {...searchUserState,users:[...users, action.user]}
        }
        case SEARCH_PRODUCTS_BY_TAGS:{
            return { ...state, products: action.products}
        }
        case ON_CHANGE_SEARCH:{
            return { ...state, search: action.search }
        }
        case ON_CHANGE_SEARCH_TYPE:{
            return { ...state, searchType: action.searchType}
        }
        case LOG_OUT:
            return initState
        default:
            return state;
    }
}
