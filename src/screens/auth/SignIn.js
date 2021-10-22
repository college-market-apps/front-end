import React,{useState,useEffect} from 'react'
import {shadows} from '../../shared/styles'
import {auth} from '../../../firebase'
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TextInput,
    TouchableOpacity
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { singInWithFB, singInLoading, singInWithFBToken } from '../../store/reducers/auth'

function mapState(state){

    function prouctInGroupChat(sellerId, productId){
        const { products } = state.ShoppingCart.shoppingCarts.find(x=>x?.users?.find(y=>String(y.id) === String(sellerId))) || {}
        if (!products) return false
        const exist = products.find(x=>String(x.id)===String(productId))
        return !!exist
    }

    return {
        loading: state.Auth.singInLoading,
        uid: state.Auth.uid
    }
}


export default function SingIn({navigation}){
    const { loading, uid } = useSelector(mapState)
    const [showSplashScreen, setShowSplashScreen] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const dispatch = useDispatch()
    function goToProducts(){
        navigation.reset({ index: 0, routes: [{ name: 'Nav' }],})
    }

    async function firebaseSingIn(){
        try {
            const res = await auth.signInWithEmailAndPassword(email,password)
            const {uid, accessToken } = res?.user
            if (!uid) return alert('There was an error loagin in please try again')
            dispatch(singInLoading(true))
            dispatch(singInWithFB(accessToken))
        } catch (error) {
            setErrorMessage(error.message)
            console.error(error)
        }
    }

    // useEffect(() => {
    //     const unsubscribe = auth.onAuthStateChanged(async(stuff)=>{
    //         const token  = await stuff.getIdToken()
    //         if (token){
    //             dispatch(singInLoading(true))
    //             dispatch(singInWithFBToken(token))
    //         }
    //     })
    //     return unsubscribe
    // }, [])

    // if (showSplashScreen){
    //     return <Text>Loading....</Text>
    // }
    // if (uid) {
    //     goToProducts()
    //     return null
    // }
    return (
        <SafeAreaView style={styles.safeArea}>
            <Text style={styles.welcome}>Welcome to {'\n'}College Market</Text>
            <View style={styles.feildInputs}>
                <View style={styles.inputFeild}>
                    <TextInput placeholder="email" value={email} onChangeText={(text)=>setEmail(text)}/>
                </View>
                <View style={styles.inputFeild}>
                    <TextInput placeholder="password" value={password} onChangeText={(t)=>setPassword(t)}/>
                </View>
                { !!errorMessage && (<Text style={styles.errorMessage}>{errorMessage}</Text>)}
            </View>
            { !loading && (<TouchableOpacity style={styles.submit} onPress={()=>{
                firebaseSingIn()
            }}>
                <Text style={styles.login}>Login</Text>
            </TouchableOpacity>)}

            <View style={styles.links}>
                <Text>Forgot your password?</Text>
                <Text onPress={()=>navigation.reset({ index: 0, routes: [{ name: 'SignUp' }],})}>Need to sign up?</Text>
            </View>
        </SafeAreaView>
    )
}


const styles= StyleSheet.create({
    safeArea:{
        height: '100%',
        alignItems:'center',
        // justifyContent: 'center',
        marginTop: 20
    },
    welcome:{
        fontSize: 40,
        marginBottom: 50,
        marginTop: 50,
        width: '90%',
    },
    feildInputs:{
        width: '90%',
        alignItems:'center',
        // backgroundColor:'lightgrey',
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 10
    },
    inputFeild:{
        height: 50,
        width: '100%',
        backgroundColor:'white',
        borderRadius: 10,
        ...shadows,
        justifyContent: 'center',
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    login:{
        fontSize: 20,
        color: 'white',
    },
    submit:{
        height: 50,
        width: '90%',
        backgroundColor:'#0f4a86',
        borderRadius: 10,
        marginTop: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    links:{
        width: '85%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    errorMessage:{
        color:'red'
    }
})
