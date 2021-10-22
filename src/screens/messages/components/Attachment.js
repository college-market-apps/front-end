import React,{useState, useEffect} from 'react'
import { View, Text, StyleSheet,Image, TouchableOpacity, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { presignedGETURL } from '../../../helpers/S3'
export default function Attachement({id, type,imageUrl }){
    const navigation = useNavigation()
    const [uri, setUri] = useState(imageUrl)
    useEffect(() => {
        if (!imageUrl.includes('://') && imageUrl) setUri(presignedGETURL(imageUrl))
        
    }, [])

    function onViewProduct(){
        navigation.navigate('ProductsStack',{
            screen: "Single Product",
            params:{
                productId: id,
            }
        })
    }
    return (
        <TouchableOpacity style={styles.attachement} onPress={onViewProduct}>
            <Image  source={{uri: imageUrl}} style={styles.image}/>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    attachement:{
        marginBottom: 10
    },
    image:{
        height: 200,
        width:200,
        borderRadius: 10
    }
})
