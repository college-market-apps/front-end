import { AsyncStorage } from "react-native";

export const storeToLocal = async (data) => {
        const strData = JSON.stringify(data)
        try {
            await AsyncStorage.setItem(
                'postItem',
                strData
            );
        } catch (error) {
            // Error saving data
            console.log('error seting to local storage', error)
        }
    };

export const retrieveFromLocal = async () => {
    try {
        const value = await AsyncStorage.getItem('postItem');
        const data = value || '{}'
        return JSON.parse(data)
    } catch (error) {
        // Error retrieving data
        console.log('error retriving from local-->', error)
    }
};

export const addATagToLocal = async (tag)=>{
    try {
        const data = await retrieveFromLocal()
        const oldList = data?.tags || []
        const newTagsList = [tag, ...oldList]
        data.tags = newTagsList
        await storeToLocal(data)
        return data
    } catch (error) {
        console.log('error adding tag')
    }
}

export const addTagsToLocal = async (tags)=>{
    try {
        const data = await retrieveFromLocal()
        data.tags = tags
        await storeToLocal(data)
        return await retrieveFromLocal()
    } catch (error) {
        console.log('error adding tag')
    }
}

export const storeStepOne = async (stepOne)=>{
    try {
        const data = await retrieveFromLocal()
        data.stepOne = stepOne
        await storeToLocal(data)
        return
    } catch (error) {
        console.log('error storaging step one data-->', error)
    }
}

export const storeStepTwo = async (stepTwo)=>{
    try {
        const data = await retrieveFromLocal()
        data.stepTwo = stepTwo
        await storeToLocal(data)
        return
    } catch (error) {
        console.log('error storaging step one data-->', error)
    }
}
