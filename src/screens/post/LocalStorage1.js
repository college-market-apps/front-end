import { AsyncStorage } from "react-native";

export const storeToLocal = async (data) => {
    const strData = JSON.stringify(data)
    try {
        await AsyncStorage.setItem('post', strData );
    } catch (error) {
        // Error saving data
        console.log('error seting to local storage', error)
    }
};

export const getLocalPost = async () => {
    try {
        const value = await AsyncStorage.getItem('post');
        const data = value || '{}'
        return JSON.parse(data)
    } catch (error) {
        // Error retrieving data
        console.log('error retriving from local-->', error)
    }
};

// SAVE Images
export const addImage_LS = async (image)=>{
    try {
        const data = await getLocalPost()
        const oldImages = data?.images || []
        data.images = [image, ...oldImages]
        await storeToLocal(data)
    } catch (error) {
        console.log('error adding image', error)
    }
}

// DELETE image
export const deleteImage_LS = async (image)=>{
    try {
        const data = await getLocalPost()
        const oldList = data?.images || []
        data.images = oldList.filter(i=>i.uri !== image.uri)
        await storeToLocal(data)
    } catch (error) {
        console.log('error deletinging image')
    }
}

// SAVE
export const saveSepTwo_LS = async (stepTwo)=>{
    try {
        const data = await getLocalPost()
        data.stepTwo = stepTwo
        await storeToLocal(data)
    } catch (error) {
        console.log('error storaging step one data-->', error)
    }
}

// SAVE Tag
export const addTag_LS = async (tag)=>{
    try {
        const data = await getLocalPost()
        const oldList = data.tags || []
        data.tags = [tag, ...oldList]
        await storeToLocal(data)
    } catch (error) {
        console.log('error adding tag', error)
    }
}

// DELETE tag
export const deleteTag_LS = async (tag)=>{
    try {
        const data = await getLocalPost()
        if (!data?.tags) return // no preset data
        const newList = data.tags.filter(t=> t!==tag)
        data.tags = newList
        await storeToLocal(data)
    } catch (error) {
        console.log('error deleting tag',error)
    }
}
