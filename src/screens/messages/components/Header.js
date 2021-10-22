import React,{ useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions} from 'react-native'
const { width } = Dimensions.get('window')
import { presignedGETURL } from '../../../helpers/S3'
import AntDesign from "react-native-vector-icons/AntDesign"

export default function Header({name,vewingUser, onPress}){
    const [uri,setUri] = useState(vewingUser.profileImage)
    useEffect(()=>{
        if (!vewingUser?.profileImage?.includes('://') && vewingUser.profileImage) setUri(presignedGETURL(vewingUser.profileImage))
    },[vewingUser])
    return (
        <View style={styles.headerContainer}>
            <View style={styles.container}>
                { !!uri ? <Image source={{ uri }} style={styles.profileImage}/> : <View style={[styles.profileImage, {borderWidth: 0}]}></View> }
                <Text style={styles.name}>{name}</Text>
                <TouchableOpacity onPress={onPress}>
                    <AntDesign name="shoppingcart" style={styles.icon}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export function ShoppingCartHeaderRight(){
    return (
        <Veiw>
            <Text>Hello world</Text>
        </Veiw>
    )
}

export const styles = StyleSheet.create({
    HeaderStyles:{
        width,
        height: 60,
        justifyContent:'center',
        alignItems:'center'
    },
    headerContainer:{
        height:'100%',
        width: width ,
        backgroundColor:'white',
        justifyContent: 'space-between',
        flexDirection:'row',
        alignItems:'center',
    },
    container:{
        width:'90%',
        marginRight: 'auto',
        marginLeft:'auto',
        flexDirection:'row'
    },
    profileImage:{
        height: 40,
        width:40,
        borderRadius: 100,
        borderWidth: 1,
        borderColor:'black'
    },
    name:{
        fontSize: 20,
        fontWeight: '600',
        marginLeft:'auto',
        marginRight:'auto',
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        textAlign:'center'
    },
    icon: {
        fontSize: 30
    }
})
