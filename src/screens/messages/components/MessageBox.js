import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native'
import {connect} from 'react-redux'
import {addMessages} from '../../../store/reducers/shoppingcart'
import moment from 'moment'
moment().format()
import { getLastChatOpened, changeLastChatOpened } from '../LocalStorage'
import Toast from 'react-native-toast-message';

function MessageBox({navigation, groupId, groups, currentUserId}){
    const [ hasNewMessage, setHasNewMessage ] = useState(false)
    useEffect(()=>{
        checkIfHasNewMessage()
    },[ groups ])

    function getUserToDisplay(currentGroup){
        const { usersData: users } = currentGroup || {}
        if (!users) return ' - '
        return users.find(x=>String(x.id) !== String(currentUserId))
    }

    const currentGroup = groups.find(x=> x.groupId === groupId) || {}
    const lastMessage = currentGroup.lastMessage
    const displayUser = getUserToDisplay(currentGroup) || {}

    async function checkIfHasNewMessage(){
        const newestMessage = currentGroup.lastMessage
        const lastReadChatId = await getLastChatOpened(groupId)
        if (newestMessage.chatId !== lastReadChatId && String(newestMessage.userId) !== String(currentUserId)) {
            setHasNewMessage(true)
            Toast.show({
                text1: `You have a new message`,
                text2: newestMessage.messageText
            })
        }
    }

    function onOpenChatRoom(){
        const newestMessage = currentGroup.lastMessage
        changeLastChatOpened(groupId, newestMessage.chatId)
        setHasNewMessage(false)
        navigation.navigate('SingleMessage',{groupId})
    }

    return (
        <TouchableOpacity style={styles.messageBox} onPress={onOpenChatRoom}>
            <Image style={[styles.profileImage, hasNewMessage ? {borderWidth: 4, borderColor:'#50c778'}: {}]} source={{uri: displayUser.profileImage}}/>
            <View style={[styles.messageDetail]}>
                <View style={styles.messageHeader}>
                    <Text style={styles.userName}>{displayUser.name}</Text>
                    <Text style={styles.date}>{moment(lastMessage.createdAt).fromNow()}</Text>
                </View>
                <Text style={styles.lastMessage} ellipsizeMode='tail' numberOfLines={2}>{lastMessage?.messageText || ''}</Text>
            </View>
        </TouchableOpacity>
    )
}

const mapState = (state)=>{
    return {
        currentUserId: state.User.id,
        groups: state.ChatRooms.groups,
        groupMessages: state.ChatRooms.groupMessages,
    }
}
const mapDispatch= (dispatch) =>{
    return {
        addMessages:(message, groupId)=>dispatch(addMessages(message, groupId)),
    }
}
export default connect(mapState, mapDispatch)(MessageBox)

const styles = StyleSheet.create({
    messageBox:{
        height: 80,
        width: '90%',
        flexDirection:'row',
        alignItems:'center',
        marginTop: 10,
        marginBottom: 10,
        marginLeft:'auto',
        marginRight:'auto',
    },
    profileImage:{
        height: 80,
        width: 80,
        // borderWidth: 1,
        borderColor: 'green',
        borderRadius: 100,
    },
    messageDetail:{
        flex: 1,
        height: '70%',
        marginLeft:10
        // justifyContent:'center',
        // backgroundColor:'yellow'
    },
    messageHeader:{
        // flex: 1,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    userName:{
        fontWeight: '600',
        fontSize: 16
    },
    date:{
        fontSize: 14,
        color: 'green'
    },
    lastMessage:{
        fontSize: 14,
        // backgroundColor:'yellow'
    }
})
