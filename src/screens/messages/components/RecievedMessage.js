import React,{useState} from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import moment from 'moment';
moment().format();
import Attachement from './Attachment'
import {shadow} from '../../../shared/styles'
export default function RecivedMessage(props){
    const [viewDate, setViewDate] = useState(false)
    const { messageText, createdAt, attachment } = props
    const hasAttachment = !!Object.keys(attachment || {}).length
    return (
        <View style={styles.recivedMessage} >
            { hasAttachment && ( <Attachement {...attachment} /> ) }
            <TouchableOpacity style={styles.touchableMessage}onPress={()=>setViewDate(!viewDate)}>
                <View style={styles.messageContainer}>
                    <View style={styles.message}>
                        <Text>{messageText || ''} </Text>
                    </View>
                </View>
            </TouchableOpacity>
            {viewDate && createdAt && ( <Text style={styles.messageDateLeft}>{moment(createdAt).fromNow() || '--'}</Text>)}
        </View>
    )
}

const styles = StyleSheet.create({
    recivedMessage:{
        minHeight: 30,
        maxWidth: '70%',
        borderRadius: 10,
        marginLeft: 10,
        marginTop: 10,
        marginRight: 'auto',
        ...shadow,
    },
    messageContainer:{
        borderRadius: 10,
        overflow:'hidden',
        marginRight:'auto'
    },
    message:{
        backgroundColor:'lightgrey',
        padding: 10,
        borderRadius: 10,
        maxWidth: 200,
        minHeight: 10,
        minWidth: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageDateLeft:{
        marginLeft: 10,
        marginTop: 5,
        fontSize: 12
    },
    touchableMessage:{
        marginLeft:'auto'
    }
})
