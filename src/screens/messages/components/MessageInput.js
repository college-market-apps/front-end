import React,{useState} from 'react'
import { View, Text, TextInput, StyleSheet,KeyboardAvoidingView, TouchableOpacity } from 'react-native'

import FirebaseHelper2 from '../../../helpers/FirebaseHelper'


export default function MessageInput({userId, groupId, onSendMessage}){
    const [message,setMessage] = useState('')

    async function sendMessage(){
        if (!message) return alert('Please add a message to send.')
        await FirebaseHelper2.sendMessage({
            messageText: message,
            createdAt: new Date(),
            userId,
            attachment:{},
            groupId
        })
        setMessage('')
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={90}>
            <View style={styles.messageBox}>
                <TextInput
                    placeholder="send a message..."
                    value={message}
                    style={styles.input}
                    multiline={true}
                    onChangeText={setMessage}
                />
                <TouchableOpacity style={styles.send} onPress={()=>{
                    onSendMessage(message)
                    setMessage('')
                }}>
                    <Text>Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}


const styles = StyleSheet.create({
    messageBox:{
        width:'100%',
        minHeight: 50,
        backgroundColor:'white',
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
        // position: 'absolute',
        bottom:0,
        padding: 10
    },
    input:{
        minHeight: 35,
        maxHeight: 100,
        flex: 1,
        fontSize: 16,
        backgroundColor:'lightgrey',
        borderRadius: 5,
        padding: 5
    },
    send:{
        height: 35,
        width: 100,
        marginLeft: 10,
        backgroundColor:'lightgreen',
        marginTop: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:5
    }
})
