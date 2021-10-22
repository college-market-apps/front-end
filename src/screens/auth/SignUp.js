import React,{useState} from 'react'
import {shadows} from '../../shared/styles'
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TextInput,
    TouchableOpacity
} from 'react-native'
import {auth} from '../../../firebase'
import {LocalStorage, setToken} from '../../helpers/LocalStorage'
import { signUp as authSignUp, singUpLoading } from '../../store/reducers/auth'
import { useDispatch, useSelector } from 'react-redux'

function mapState(state){
    return {
        userLoagedInBySingUp: state.Auth.userLoagedInBySingUp
    }
}

export default function SignUp({navigation}){
    const dispatch = useDispatch()
    const [errorMessage, setErrorMessage] = useState('')
    const [email,setEmail] = useState('email@email.com')
    const [password,setPassword] = useState('123456')
    const [school, setSchool] = useState(0)
    const [name, setName] = useState('Email Name')

    async function firebaseSignUp(){
        try {
            const res = await auth.createUserWithEmailAndPassword(email, password)
            dispatch(authSignUp({ email, name, schoolId: 1 }))
        } catch (error) {
            setErrorMessage(error.message)
            console.error(error)
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <Text style={styles.welcome}>Welcome to {'\n'}College Market</Text>
            <View style={styles.feildInputs}>
                <View style={styles.inputFeild}>
                    <TextInput placeholder="school" value={school} onChangeText={(text)=>setSchool(text)}/>
                </View>
                <View style={styles.inputFeild}>
                    <TextInput placeholder="name" value={name} onChangeText={(text)=>setName(text)}/>
                </View>
                <View style={styles.inputFeild}>
                    <TextInput placeholder="email" value={email} onChangeText={(t)=>setEmail(t)}/>
                </View>
                <View style={styles.inputFeild}>
                    <TextInput placeholder="password" value={password} onChangeText={(t)=>setPassword(t)}/>
                </View>
                {!!errorMessage && <Text>{errorMessage}</Text>}
            </View>
            <TouchableOpacity style={styles.submit} onPress={()=>firebaseSignUp()}>
                <Text style={styles.login}>Sign Up</Text>
            </TouchableOpacity>
            <View style={styles.links}>
                <Text onPress={()=>navigation.reset({ index: 0, routes: [{ name: 'SignIn' }],})}>Have an account?</Text>
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
    }
})
