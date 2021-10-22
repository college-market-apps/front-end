import { AsyncStorage } from "react-native";

export const storeToLocal = async (data) => {
    const strData = JSON.stringify(data)
    try {
        await AsyncStorage.setItem('chats', strData );
    } catch (error) {
        // Error saving data
        console.log('error seting to local storage', error)
    }
};

export const getLocalChatOpens = async () => {
    try {
        const value = await AsyncStorage.getItem('chats');
        const data = value || '{}'
        return JSON.parse(data)
    } catch (error) {
        // Error retrieving data
        console.log('error retriving from local-->', error)
    }
};

export const changeLastChatOpened = async  (groupId, chatId)=>{
    try {
        const data = await getLocalChatOpens()
        data[groupId] = chatId
        await storeToLocal(data)
    } catch (error) {
        console.log('there was an error with addLastOpendMessage', error)
    }
}

export const getLastChatOpened = async (groupId)=>{
    try {
        const data = await getLocalChatOpens()
        return data[groupId]
    } catch (error) {
        console.log('error getting last opened', error)
    }
}
