import API, { copyObject } from '../../helpers/api'
import { LOG_OUT } from './auth'
const INIT_GROUPS = 'INIT_GROUPS'
const ADD_FB_GROUP = 'ADD_FB_GROUP'
const INIT_GROUP_MESSAGES = 'INIT_GROUP_MESSAGES'
const ADD_FB_GROUP_MESSAGES = 'ADD_FB_GROUP_MESSAGES'
const ADD_SINGLE_FB_GROUP_MESSAGE = 'ADD_SINGLE_FB_GROUP_MESSAGE'
const UPDATE_LAST_MESSAGE = 'UPDATE_LAST_MESSAGE'
const ADD_CHAT_ROOMS = 'ADD_CHAT_ROOMS'
const CHANGE_CHAT_ROOM_LOADING = 'CHANGE_CHAT_ROOM_LOADING'

export const addChatRooms = (chatRooms)=>({
    type: ADD_CHAT_ROOMS,
    chatRooms
})

export const initGroupsForMessages = (groups)=> ({
    type: INIT_GROUPS,
    groups
})

export const addGroup = (group)=>({
    type: ADD_FB_GROUP,
    group
})

export const initGroupMessages = (groupMessages, groupId)=>({
    type: INIT_GROUP_MESSAGES,
    groupMessages,
    groupId
})

export const addGroupMessages = (messages, groupId) =>({
    type: ADD_FB_GROUP_MESSAGES,
    messages,
    groupId
})

export const addNewGroupMessages = (newMessages, groupId)=>({
    type: ADD_SINGLE_FB_GROUP_MESSAGE,
    newMessages,
    groupId
})

export const updateLastMessage = (updatedChatRooms) =>({
    type: UPDATE_LAST_MESSAGE,
    updatedChatRooms
})

export const changeChatRoomLoading = (loading)=>({
    type:CHANGE_CHAT_ROOM_LOADING,
    loading
})

// THUNKS
export const addGroupToDB = (messageId, productId)=>{
    return async (dispatch)=>{
        const { data } = await API({method: 'put', body: { messageId, productId }, url: 'api/messages/addmessage'})
    }
}

const initState = {
    groups: [], // [ { groupId, lastMessage, users createdAt, isBlocked } ]
    groupMessages: [], // [ { groupId, messages:[ ] } ]
    loading: true
}

export default function GroupMessages(state=initState, action){
    switch (action.type) {
        case CHANGE_CHAT_ROOM_LOADING:{
            return { ...state, loading: action.loading }
        }
        case ADD_CHAT_ROOMS:{
            const { chatRooms } = action
            const newChatRooms = chatRooms.filter(({groupId})=>!state.groups.find(x=>x.groupId === groupId))
            return { ...state, groups: [...state.groups, ...newChatRooms], loading: false }
        }
        case INIT_GROUPS:{
            const { groups } = action
            return { ...state, groups }
        }
        case ADD_FB_GROUP:{
            const { group } = action
            return { ...state, groups: [ ...state.groups, group ]}
        }
        case INIT_GROUP_MESSAGES:{
            const { groupMessages, groupId } = action
            const exist = state.groupMessages.find(x=>x.groupId === groupId)
            if (exist) return { ...state }
            const message =  { groupId, messages: groupMessages }
            return { ...state, groupMessages: [ ...state.groupMessages, message ] }
        }
        case ADD_FB_GROUP_MESSAGES:{
            return { ...state, groupMessages: [...state.groupMessages, action.messages ] }
        }
        case ADD_SINGLE_FB_GROUP_MESSAGE:{
            const { groupId, newMessages } = action
            let copyMessages = copyObject(state.groupMessages)
            let groupIndex = copyMessages.findIndex(x=> x.groupId === groupId)
            const acutallyNew = newMessages.reduce((a,c)=> {
                const exist = copyMessages.find(copy=> copy?.messages?.find(x=> x.chatId === c.chatId))
                if (!exist) a.push(c)
                return a
            },[])
            if ( groupIndex > -1  && state.groupMessages.length) {
            const { messages:olderMessages } = copyMessages[groupIndex]
            copyMessages[groupIndex] =  { groupId, messages: [ ...olderMessages, ...acutallyNew] }
            }
            else copyMessages.push({ groupId, messages: acutallyNew })
            return { ...state, groupMessages: copyMessages }
        }
        case UPDATE_LAST_MESSAGE:{
            const { updatedChatRooms } = action
            let copyGroups = copyObject(state.groups)
            const updatedGroups = copyGroups.map((group)=>{
                const { groupId } = group
                const updatedGroup = updatedChatRooms.find(x=>x.groupId===groupId)
                if (updatedGroup) group.lastMessage = updatedGroup.lastMessage
                return group
            })
            return { ...state, groups: updatedGroups }
        }
        case LOG_OUT:
            return initState
        default:
            return state;
    }
}
