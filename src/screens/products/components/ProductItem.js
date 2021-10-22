import React,{ useState, useEffect } from 'react'
import { View,TouchableOpacity, Text,StyleSheet,Dimensions,Image } from "react-native";
import { presignedGETURL } from '../../../helpers/S3'

const windowWidth = Dimensions.get('window').width;
const defaultImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMvZ5Y-5HFVqtifQWSZz37wid8f6RilVXY1rmH95eqdkNEvP7COyJZudOmyivALP7_oxA&usqp=CAU'
export default function Product({title, price, isOdd, onNavigate, image, lastIsOdd}){
    const descriptionStyle = isOdd ?  styles.descriptionRight : styles.descriptionLeft
    const [uri, setUri] = useState(presignedGETURL(image))

    function onError(){
        setUri(defaultImage)
    }

    useEffect(()=>{
        if (image.includes('://')) setUri(image)
        else setUri(presignedGETURL(image))
    },[])

    return (
        <TouchableOpacity style={[styles.product, lastIsOdd ? {marginRight: 'auto'} : {}]} onPress={onNavigate}>
            <Image style={styles.image} source={{ uri }} resizeMode='cover' onError={onError} />
            <View style={descriptionStyle}>
                <Text numberOfLines={2} style={styles.title}>{title}</Text>
                <Text style={styles.price}>${price}</Text>
            </View>
        </TouchableOpacity>
    )
}

const shadow = {
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
}

const styles = StyleSheet.create({
    product:{
        backgroundColor: 'white',
        // Dimenstions
        height: windowWidth /2 -7 ,
        width: windowWidth /2 -7,
        marginBottom: 60
    },
    image:{
        height: '100%',
        width: '100%',
        backgroundColor:'#ededed',
    },
    descriptionLeft: {
        paddingLeft: 10,
        width: '100%',
    },
    descriptionRight:{
        width: '100%',
        paddingRight: 10,
    },
    title:{
        width:'100%',
        fontWeight:'600',
        fontSize:17,
        marginTop: 5
    },
    body:{
        fontSize: 13,
    },
    price:{
        marginTop: 2.5
    }
})
