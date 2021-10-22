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

export const resetPostForm = async ()=>{
    try {
        const initFormik = {
            images: [],
            tags: [],
            stepTwo: {
                title: "" ,
                description: '',
                placesCanMeet:'',
                condition: '',
                sellType: '',
            },
        }
        const strData = JSON.stringify(initFormik)
        await AsyncStorage.setItem( 'postItem',strData);
    } catch (error) {
        console.log('there was an erro reseting form')
    }
}

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
        if (!data)return // no preset data
        data.tags = tags
        await storeToLocal(data)
        return await retrieveFromLocal()
    } catch (error) {
        console.log('error adding tag', error)
    }
}

export const deleteALocalTag = async (tag)=>{
    try {
        const data = await retrieveFromLocal()
        if (!data?.tags) return // no preset data
        const newList = data.tags.filter(t=> t!==tag)
        data.tags = newList
        await storeToLocal(data)
        return await retrieveFromLocal()
    } catch (error) {
        console.log('error deleting tag',error)
    }
}

export const addAnImageToLocal = async (image)=>{
    try {
        const data = await retrieveFromLocal()
        const oldList = data?.images || []
        data.images = [image, ...oldList]
        await storeToLocal(data)
        return data
    } catch (error) {
        console.log('error adding tag')
    }
}

export const deleteALocalImage = async (image)=>{
    try {
        const data = await retrieveFromLocal()
        const oldList = data?.images || []

        data.images = oldList.filter(i=>i.uri !== image.uri)
        await storeToLocal(data)
    } catch (error) {
        console.log('error deletinging image')
    }
}

export const storeStepOne = async (stepOne)=>{
    try {
        const data = await retrieveFromLocal()
        data = {
            ...data,
            ...stepOne
        }
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

export const changeSellType = async (type)=>{
    try {
        if (!['product','service'].includes(type)) return
        const data = await retrieveFromLocal()
        data.itemType = type
        await storeToLocal(data)
        return
    } catch (error) {
        console.log('error storaging step one data-->', error)
    }
}
