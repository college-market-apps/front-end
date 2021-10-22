import React from 'react'
import * as Progress from 'react-native-progress';
import { View, Text, StyleSheet} from 'react-native'

export default ({text})=>{
    return (
        <View style={s.page}>
            <Progress.Circle size={100} indeterminate={true} />
            {text && <Text style={s.text}>{text}</Text>}
        </View>
    )
}
const s = StyleSheet.create({
    page:{
        height:'100%',
        width:'100%',
        backgroundColor:'white',
        justifyContent: 'center',
        alignItems:'center'
    },
    text:{
        marginTop: 10,
        fontSize: 15,
        fontWeight:'600',
        width: "90%",
        textAlign:'center'
    }
})
