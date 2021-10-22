import React,{ useState, useEffect, useCallback} from "react";
import { Text, StyleSheet ,SafeAreaView, ScrollView, FlatList } from "react-native";
import MessageBox from './components/MessageBox'
import FirebaseHelper2 from '../../helpers/FirebaseHelper'
import { addChatRooms, updateLastMessage, changeChatRoomLoading } from '../../store/reducers/groupMessages'
import { fetchShoppingCart } from '../../store/reducers/shoppingcart'
import { connect } from 'react-redux'
import CircleProgress from '../components/Progress'
import Toast from 'react-native-toast-message';


function Messages({ navigation, addChatRooms, updateLastMessage, fetchShoppingCart, changeChatRoomLoading, groups, userId , loading }) {
    const [isRendered, setIsRendered] = useState(false)
    const [ groupsData, setGroupData ] = useState(groups)

    function onCompletLoading(){
        changeChatRoomLoading(false)
    }
    const FBListener = useCallback(()=>{
        const unsub = FirebaseHelper2.setTextMessageListeners({ userId, onAddChatRooms, onUpdateRooms, onCompletLoading })
        return unsub
    },[])

    function onAddChatRooms({ chatRooms }){
        showToast(chatRooms)
        addChatRooms(chatRooms)
    }

    function onUpdateRooms({ updatedChatRooms}){
        updateLastMessage(updatedChatRooms)
    }

    function showToast(newGroups){
        const hasNewMessage = newGroups.filter(({ groupId })=> {
            return !groups.find(x=>x.groupId === groupId)
        })

        if (hasNewMessage.length && groups.length) {
            Toast.show({
            text1: 'You have a new message'
        })
        }
    }

    function sortMessages(list){
        return list.sort((a,b)=> Date.parse(b.lastMessage.createdAt) - Date.parse(a.lastMessage.createdAt))
    }

    useEffect(()=>{
        const unsub = FBListener()
        // fetchShoppingCart()
        return unsub
    },[ ])

    const sortedGroups = sortMessages(groups)
    if (loading) return <CircleProgress text={'Loading your messages. Please wait...'} />


    function renderItems({item, index}){
        const { groupId } = item
        return <MessageBox key={index} navigation={navigation} groupId={groupId}/>
    }

    return (
        <SafeAreaView style={styles.welcome}>
            <FlatList
                data={sortedGroups}
                renderItem={renderItems}
                ListEmptyComponent={<Text style={styles.noMessages}>No messages found.</Text>}
                keyExtractor={item=>item.groupId}
            />
        </SafeAreaView>
    );
}

const mapState = (state)=>{
    return {
        groupMessages: state.ShoppingCart.shoppingCarts,
        groups: state.ChatRooms.groups,
        userId: state.User.id,
        loading: state.ChatRooms.loading
    }
}

const mapDispatch = (dispatch) =>{
    return {
        addChatRooms: (rooms)=> dispatch(addChatRooms(rooms)),
        updateLastMessage:(updatedChatRooms)=>dispatch(updateLastMessage(updatedChatRooms)),
        fetchShoppingCart:()=>dispatch(fetchShoppingCart()),
        changeChatRoomLoading:(bool)=>dispatch(changeChatRoomLoading(bool))
    }
}

export default connect(mapState,mapDispatch)(Messages)

const styles = StyleSheet.create({
    welcome: {
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: 'center',
    },
    noMessages:{
        marginTop: 20,
        width:'100%',
        textAlign:'center'
    }
});
