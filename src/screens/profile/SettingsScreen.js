import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { auth } from '../../../firebase'
import { logOut } from '../../store/reducers/auth'
import { useDispatch } from 'react-redux'
export default function SettingsScreen(){
    const dispatch = useDispatch()
    async function onSignOut(){
        try {
            const data = await auth.signOut()
            if (!data) dispatch(logOut())

        } catch (error) {
            console.log('Error loginOut-->', error)
        }
    }
    return (
        <View>
            <TouchableOpacity style={styles.signOut} onPress={onSignOut}>
                <Text>Sign Out</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    signOut:{
        height: 30,
        width: 150,
        backgroundColor:'lightgrey',
        justifyContent: 'center',
        alignItems: 'center',
    }
})
