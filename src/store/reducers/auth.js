function copyObject(obj){
    return JSON.parse(JSON.stringify(obj))
}
const baseUrl = 'http://localhost:3000'
import API from '../../helpers/api'

const USER_SIGNED_UP = 'USER_SIGNED_UP'
const CHANGE_SING_UP_LOADING = 'CHANGE_SING_UP_LOADING'
const CHANGE_SING_IN_LOADING = 'CHANGE_SING_IN_LOADING'
const SET_APP_LOADING = 'SET_APP_LOADING'
const UPDATE_UID = 'UPDATE_UID'
export const LOG_OUT = 'LOG_OUT'

export const signedUp = ()=>{
    return {type:USER_SIGNED_UP}
}

export const singUpLoading = (laoding)=>({
    type:CHANGE_SING_UP_LOADING,
    laoding
})

export const singInLoading = (loading)=>({
    type: CHANGE_SING_IN_LOADING,
    loading
})

export const updateUID = (uid)=>({
    type: UPDATE_UID,
    uid
})

export const setAppLoading = (loading)=>({
    type:SET_APP_LOADING,
    loading
})

export const logOut = ()=>({
    type: LOG_OUT
})


export const authByUID = (uid)=>{
    return async (dispatch)=>{
        const { data } = await API({ url:'/api/auth/login', body: { uid }, method:'post' })
    }
}

export const signIn = (fbToken)=>{
    return async (dispatch)=>{
        try {
            const { data } = await API({ method: 'put', url: '/api/auth/signin', body:{ fbToken },  })
        } catch (error) {

        }
    }
}

export const signUp = ({ name, email, schoolId})=>{
    return async (dispatch)=>{
        const { data } = await API({ url: '/api/auth/signup', body:{ email, name, schoolId }, method:'post'})
        dispatch(updateUID(data?.uid))
        dispatch(singUpLoading(false))

    }
}

export const singInWithFB = ()=>{
    return async (dispatch)=>{
        const { data, status } = await API({ url: '/api/auth/signin', method:'put' })
        dispatch(updateUID(data?.uid))
        dispatch(singInLoading(false))

    }
}

export const singInWithFBToken =(fbtoken)=>{
    return async (dispatch)=>{
        try {
            const { data } = await API({ url:'/api/auth/signin', method:'put', headers:{ fbtoken }})
            dispatch(updateUID(data?.uid))
        } catch (error) {
            dispatch(setAppLoading(false))
        }
        // dispatch(singInLoading(false))
    }
}

const initAuth = {
    uid: '',
    userLoagedInBySingUp: false,
    signUpLaoding: false,
    singInLoading: false,
    appLoading: true
}

export default function auth(state=initAuth, action={}){
    switch (action.type) {
        case USER_SIGNED_UP:
            return { ...state, userLoagedInBySingUp: true }
        case CHANGE_SING_IN_LOADING:
            return { ...state, singInLoading: action.laoding }
        case UPDATE_UID:
            return { ...state, uid: action.uid, appLoading: false}
        case SET_APP_LOADING:
            return { ...state, appLoading: action.laoding}
        case LOG_OUT:
            return initAuth
        default:
            return state
    }
}
