import React, { useEffect, useState, useCallback, useLayoutEffect } from 'react'
import {
    View,
    ScrollView,
    StyleSheet,
} from 'react-native'
import {shadow} from '../../shared/styles'
import {connect} from 'react-redux'

import MessageInput from './components/MessageInput'
import SentMessage from './components/SentMessage'
import RecievedMessage from './components/RecievedMessage'
import FirebaseHelper2 from '../../helpers/FirebaseHelper'
import { updateLastMessage, initGroupMessages, addNewGroupMessages } from '../../store/reducers/groupMessages'
import { useNavigation } from '@react-navigation/native';
import Header, { styles as HStyles } from './components/Header'

function SingleMessage(props){
    const {route,userId, addNewGroupMessages, getViewingUserName, getMessages, getViewingUser} = props
    const navigation = useNavigation()
    const [loading, setLoading] = useState(true)
    const [isMounted, setIsMounted] = useState(false)
    const [scrollToBottom, setScrollToBottom ] = useState(true)
    const { groupId } = route.params
    const { messages } = getMessages(groupId)
    const userMessagesCount = messages.reduce((a,c)=>{ if (c.userId === userId) a++; return a },0)
    const vewingUserName = getViewingUserName(groupId, userId)
    const vewingUser = getViewingUser(groupId, userId)
    const [visibleCart, setVisibleCart] = useState(false)

    useLayoutEffect(()=>{
        navigation.setOptions({
            headerTitle: <Header name={vewingUserName} vewingUser={vewingUser} onPress={onShowCarts}/>,
            headerLeft:null,
            headerLeftContainerStyle: { width: 0 },
            headerRightContainerStyle: { width: 0 },
            headerTitleContainerStyle: HStyles.HeaderStyles
        })
    },[])

    function onShowCarts(){
        navigation.navigate('Shopping Cart', { groupId })
    }

    const UserMessages = useCallback( ()=>{
        const unsub =  FirebaseHelper2.getSingleGroupMessages(groupId, onSnapShotUpdate)
        setLoading(false)
        return unsub
    },[ ])

    function onSnapShotUpdate({ groupId, data }){
        addNewGroupMessages(data, groupId)
    }

    function sortMessages(){
        return messages.sort((a,b)=> Date.parse(a.createdAt) - Date.parse(b.createdAt) )
    }

    async function onSendMessage(message){
        if (!message) return alert('Please add a message to send.')
        if (userMessagesCount === 10) return alert('You have reached your messages limate')
        await FirebaseHelper2.sendMessage({
            messageText: message,
            createdAt: new Date(),
            userId,
            attachment:{},
            groupId
        })
    }

    useEffect(() => {
        let unsub = UserMessages()
        return unsub
    }, [ ])
    const sortedMessages = sortMessages(messages || [])

    return(
        <View style={styles.page}>
        <ScrollView
            contentContainerStyle={styles.scrollView}
            ref={ref => {this.scrollView = ref}}
            onContentSizeChange={() => {
                if (scrollToBottom){
                    this.scrollView.scrollToEnd({ animated: false })
                }
                if (scrollToBottom) setTimeout(()=>{
                    setScrollToBottom(false)
                },500)
            }}
        >
            {
                sortedMessages.map((message,i)=>{
                    if (String(message.userId) === String(userId)) return (
                            <SentMessage {...message} key={i} />
                    )
                    else return(
                        <RecievedMessage {...message} />
                    )
                })
            }
        </ScrollView>
        <MessageInput
            groupId={groupId}
            userId={userId}
            onSendMessage={onSendMessage}
        />
        </View>
    )
}
const mapState = (state)=>{
    function getViewingUserName(groupId, userId){
        const { users=[] } = state.ShoppingCart.shoppingCarts.find(x=>x.groupId === groupId) || {}
        const { name: vewingUserName} = users.find(x=>x.id !== userId) || {}
        return vewingUserName || ''
    }

    function getViewingUser(groupId){
        const { users=[] } = state.ShoppingCart.shoppingCarts.find(x=>x.groupId === groupId) || {}
        return users.find(x=>x.id !== state.User.id) || {}
    }

    return {
        GroupChats: state.ShoppingCart.shoppingCarts || [],
        userId: state.User.id,
        getMessages: (groupId)=> state.ChatRooms?.groupMessages.find(x=>{
            return x.groupId === groupId
        }) || { messages: [] },
        lastMessage: (groupId)=> state.ChatRooms.groups.find(x=>x.groupId === groupId)?.lastMessage,
        getViewingUserName: (groupId, userId)=>getViewingUserName(groupId, userId),
        getViewingUser: (groupId) =>getViewingUser(groupId)
    }
}

const mapDispatch = (dispatch)=>({
    addNewGroupMessages: (message, id)=> dispatch(addNewGroupMessages(message, id))
})
export default connect(mapState, mapDispatch)(SingleMessage)


const styles=StyleSheet.create({
    page:{
        height:'100%',
        width:'100%',
        // backgroundColor:'yellow',
    },
    recivedMessage:{
        minHeight: 30,
        minWidth: 50,
        maxWidth: '70%',
        borderRadius: 10,
        // ...shadow,
        marginLeft: 10,
        marginTop: 10,
    },
    sendMessageBox:{
        height: 30,
        // width:'100%',

    },
    message:{
        fontSize: 16,
        borderRadius: 10,
        overflow: 'hidden',
    },
    sentMessage:{
        minHeight: 30,
        maxWidth: '70%',
        borderRadius: 10,
        marginLeft: 'auto',
        marginTop: 10,
        marginRight: 10,
        ...shadow,
    },
    message:{
        backgroundColor:'lightblue',
        padding: 10,
        borderRadius: 10
    },
    recivedMessageColor:{
        backgroundColor:'#E9EBEF',
        padding: 10,
        borderRadius: 10
    },
    messageContainer:{
        borderRadius: 10,
        overflow:'hidden'
    },
    messageDateRight:{
        marginLeft:'auto',
        marginRight: 10,
        marginTop: 5
    },
    messageDateLeft:{
        marginLeft: 10,
        marginTop: 5,
        fontSize: 12
    }
})

