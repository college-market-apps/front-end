import { AsyncStorage } from "react-native";

export const getProfilePageOpendStatus = async ()=>{
    const opened = await AsyncStorage.getItem('opendHomePage')
    return !!opened
}

export const markProfileAsOpened =async ()=>{
    return await AsyncStorage.setItem('opendHomePage','true')
}
