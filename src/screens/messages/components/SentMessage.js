import React,{useState} from 'react'
import { View, Text, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import moment from 'moment';
moment().format();

import {shadow} from '../../../shared/styles'
import Attachement from './Attachment'

export default function SentMessage(props){
    const [viewDate, setViewDate] = useState(false)
    const { messageText, createdAt, messageFocused, attachment } = props
    const hasAttachment = !!Object.keys(attachment || {}).length
    return (
        <View style={styles.sentMessage} >
            {
                hasAttachment && (
                    <Attachement {...attachment} />
                )
            }
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
    sentMessage:{
        minHeight: 30,
        maxWidth: '70%',
        borderRadius: 10,
        marginLeft: 'auto',
        marginTop: 10,
        marginRight: 10,
        ...shadow,
    },
    messageContainer:{
        borderRadius: 10,
        overflow:'hidden',
    },
    message:{
        backgroundColor:'lightblue',
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
