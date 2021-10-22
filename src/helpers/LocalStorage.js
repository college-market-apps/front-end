import React from 'react'
import { AsyncStorage } from "react-native";

export async function getToken(){
    return await AsyncStorage.getItem('token')
}

export async function setToken(token){
    try {
        await AsyncStorage.setItem('token',token)
        return true
    } catch (error) {
        console.log('error seting token')
        return false
    }
}

export async function deleteToken(){
    try {
        await AsyncStorage.setItem('token','')
        return true
    } catch (error) {
        console.log('error deleting token',error)
        return false
    }
}

const LocalStorage = {
        getToken,
        setToken,
        deleteToken
    }

export {
    LocalStorage
}
