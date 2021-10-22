import React,{useState, useEffect} from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native'
import * as ImagePicker from 'expo-image-picker';


export default ({nextStep, onAddImage,onDeleteImage,onPickProduct, data})=>{
    const { images=[] } = data

    const [showError,setShowError] = useState(false)
    function onPressNext(){
        // if (!images.length) return alert('Please add an image')
        nextStep()
    }
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
        if (!result.cancelled) {
            try {
                if (result.type !== 'image') return alert('must be an image')
                else if (images?.length === 2) return alert('max number of images')
                onAddImage(result)
            } catch (error) {
                console.log('error---->', error)
            }
        }
    }

    const numImages = images?.length

    return (
        <View style={styles.step}>
            <TouchableOpacity style={styles.addImage} onPress={pickImage}>
                <Text>Add Image</Text>
            </TouchableOpacity>
            <View style={styles.images}>
                {
                    !!images?.length && images.map((image, i)=>{
                        return (
                            <View style={[styles.imageContainer]} key={'__'+i}>
                                <Image style={[styles.image]} source={{
                                uri: image.uri
                                }}/>
                                <TouchableOpacity style={styles.circle} onPress={()=>onDeleteImage(image)}>
                                    <Text style={styles.deleteImageTxt}>x</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    })
                }
            </View>
            <TouchableOpacity
                style={[styles.next, images?.length === 10 ? {marginTop: 10}: null ]}
                onPress={onPressNext}
            >
                <Text>Next</Text>
            </TouchableOpacity>
        </View>
    )
}

const shadow = (height, width) => {
    return {
    shadowOffset: {
        width: width || 2,
        height: height || 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    };
};

const styles = StyleSheet.create({
    step:{
        width: '90%',
        flex: 1,
    },
    itemTypeTitle:{
        marginBottom: 10,
        marginRight:'auto',
        marginLeft:'auto',
    },
    itemTypes:{
        flexDirection:'row',
        justifyContent:'space-evenly',
        marginBottom: 20,
        backgroundColor:'white',
        padding:10,
        borderRadius: 5,
        ...shadow()
    },
    itemType:{
        height: 40,
        width: 120,
        backgroundColor:'lightgrey',
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle:{
        height:25,
        width: 25,
        backgroundColor:'red',
        borderRadius:100,
        justifyContent:'center',
        alignItems: 'center',
        position: 'absolute',
        right:10,
        top:10,
    },
    addImage:{
        height: 40,
        width: 150,
        borderRadius: 10,
        backgroundColor:'lightgrey',
        marginBottom: 20,
        marginRight:'auto',
        marginLeft:'auto',
        justifyContent:'center',
        alignItems: 'center',
    },
    images:{
        width: '100%',
        flexDirection:'row',
        flexWrap:'wrap',
        justifyContent:'space-evenly',
        marginRight:'auto',
        marginLeft:'auto',
        // backgroundColor:'yellow'
    },
    imageContainer:{
        // height: 110,
        // width: 110,
        marginRight:'auto',
        marginLeft:'auto',
        position:'relative',
        margin: 5,
    },
    deleteImage:{
        position:'absolute',
        top: 10,
        right:10,
        justifyContent:'center',
        alignItems: 'center',
        // borderRadius:100,
        backgroundColor:'red'
    },
    deleteImageTxt:{
        // fontSize: 20,
        color:'white'
    },
    image:{
        height: 90,
        width: 90,
        borderWidth: 1,
        borderRadius: 3
    },
    next:{
        width: 150,
        height: 40,
        backgroundColor:'lightgreen',
        // marginTop: 100,
        marginRight:'auto',
        marginLeft:'auto',
        justifyContent:'center',
        alignItems: 'center',
        borderRadius: 5,
        // position:'absolute',
        marginTop:'auto',
        marginBottom: 20,

    }
})
