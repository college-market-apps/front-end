import {db} from '../../firebase'
import { v4 as uuid } from 'uuid';

class FirebaseHelper {
    constructor(){
        //
    }

    // QUERIES
    async getLastMessage(groupId){
        const message = await db.collection('chatRooms').doc(groupId).get()
        return message
    }

    async getMessages({groupId}){
        const messages = []
        const dbMessages = await db.collection('chatRooms').doc(groupId).collection('messages').get()
        dbMessages.forEach(x=>messages.push(x.data()))
        return messages
    }

    async getAllGroupMessages(userId){
        const groups = []
        const userMessages = []
        const dbGroups = await db.collection('groups').where(`usersInGroup.${userId}`, '==',true).get()
        dbGroups.forEach(x=>groups.push(x.data()))
        for (let i = 0; i< groups.length; i++){
            let {groupId} = groups[i]
            if (!groupId) continue
            const groupMessages = await this._getMessages(groupId) // list
            userMessages.push(groupMessages)
        }
        return userMessages
    }

    // MUTATIONS
    /* user */
    async addUser(user){
        const docId = uuid()
        // ADD USER
    }

    /* chat room/messages */
    async addChatRoom({groupId, data, userId}){
        const chatRoomRef = await db.collection('chatRooms').doc(groupId).set({
            groupId,
            lastMessage: '',
            createdAt: new Date(),
            roomCreatedBy: userId // track if they are spaming users
        })
        const messages = await db.collection('chatRooms').doc(groupId).collection('messages') // create messages collection
    }

    async sendMessage(obj){
        let {messageText, groupId, attachment,createdAt, userId} = obj
        if (!messageText) return
        const chatRoomRef = db.collection('chatRooms').doc(groupId).collection('messages')
        const newMessage = await chatRoomRef.add({
            messageText: messageText,
            attachment: attachment || {},
            createdAt,
            userId
        })
        await this.updateLastMessage(groupId,{messageText, attachment: attachment||{}, createdAt, userId})
    }

    async getMessageGroups(userId){
        const groups = []
        const dbGroups = await db.collection('groups').where(`usersInGroup.${userId}`, '==',true).get()
        dbGroups.forEach(x=>groups.push(x.data()))
        return groups
    }

    async getMessageGroupsListen(userId, onSnapShotUpdate){
        const groups = []
        if (!userId) return onSnapShotUpdate([]) // default of arry for groups
        const dbGroups = await db.collection('groups').where(`usersInGroup.${userId}`, '==',true)
        dbGroups.onSnapshot(snapShot=>{
            let groups = []
            snapShot.docChanges().forEach(x=>{
                if (x.type === 'added') {
                    const data = x.doc.data()
                    if (data?.lastMessage?.createdAt) data.lastMessage.createdAt = data.lastMessage.createdAt.toDate()
                    groups.push({type: 'added', data})
                }
                if (x.type === 'modified') {
                    const data = x.doc.data()
                    if (data?.lastMessage?.createdAt) data.lastMessage.createdAt = data.lastMessage.createdAt.toDate()
                    groups.push({type: 'modified', data})
                }
            })
            onSnapShotUpdate(groups)
        })
    }

    /* groups */
    async createGroup({createdBy,data}){
        const {usersData, usersInGroup,attachment} = data
        const docId = uuid()
        const groupId = uuid()
        const groupsRef = db.collection('groups')
        const newData = await groupsRef.doc(docId).set({
            usersInGroup, // map,
            usersData,
            attachment,
            createdAt: new Date(),
            blocked: false,
            groupId,
            createdBy: createdBy || '1',
            items: {}
        })
        // maybe have a first message sent here
        return {groupId}
    }

    async updateGroup(updateData, groupKey){
        await db.collection('groups').doc(groupKey).set(updateData,{merge: true})
    }

    async sendMessageWithAttachment({data, createdBy}){
        const {usersData, usersInGroup,attachment} = data
        const userIds = Object.keys(usersInGroup || {})
        const {exist, existingGroupData} = await this._checkIfGroupExist(userIds)
        if (exist){
            const itemExist = Object.keys(existingGroupData.items).find(id=>{
                return String(id) === String(attachment.id)
            })
            const {groupKey,groupId} = existingGroupData
            if (!itemExist){
                await this.updateGroup( {
                    items:{
                        [attachment.id]: {
                        ...attachment,
                        userId: data.userId,
                    }
                    }
                }, groupKey)
            }
            await this.sendMessage({...data, groupId})
        }else{ // group dosent exist yet
            //addChatRoom
            const {groupId} = await this.createGroup({createdBy, data: {...data, attachment: { [attachment.id]: { ...attachment, userId: data.userId, }}}})
            // end message
            await this.addChatRoom({groupId,userId: data.userId})
            await this.sendMessage({...data, groupId})
        }
    }

    async updateLastMessage(groupId, update){
        const groups = await db.collection('groups').where('groupId','==',groupId).get()
        let docId;
        groups.forEach(x=>{
            if (x.id) docId = x.id
        })
        await db.collection('groups').doc(docId).update({
            lastMessage: update
        })
    }

    async _getMessages(groupId, onSnapShotUpdate){
        let count = 0
        if (!groupId) return
        const messages = []
        const dbMessages = db.collection('chatRooms').doc(groupId).collection('messages')
        const unsub = await  dbMessages.onSnapshot(snapShot=>{
            const messages = []
                snapShot.docChanges().forEach(x=>{
                    if (x.type === 'added') {
                        const data = x.doc.data()
                        if (data.createdAt) data.createdAt = data.createdAt.toDate() //JSON.stringify(data.createdAt.toDate())
                        messages.push(data)
                    }
                })
            if (messages.length){
                count++
                let type = count === 1 ? 'FIRST' : 'UPDATE'
                onSnapShotUpdate({groupId, type,data: messages})
            }
        })
        return messages
    }

    async _checkIfGroupExist(users=[]){
        if (users.length !== 2) return // only support two people chat
        const groupsDb = await db.collection('groups')
            .where(`usersInGroup.${users[0]}`, '==',true)
            .where(`usersInGroup.${users[1]}`, '==',true).get()
        let data = []
        groupsDb.forEach(x=>{
            const key = x?.id
            const xData = x.data()
            if (key) xData.groupKey = key
            data.push(xData)
        })
        return {exist: data?.length > 0 ? true : false, existingGroupData: data[0] || {}}
    }
}

class FirebaseHelper2 {
    constructor(){

    }

    async createChatRoom({groupId, data, userId}){
        const chatRoomRef = await db.collection('chatRooms').doc(groupId).set({
            groupId,
            lastMessage: '',
            createdAt: new Date(),
        })
        const messages = await db.collection('chatRooms').doc(groupId).collection('messages') // create messages collection
    }

    async updateLastMessage(groupId, update){
        await db.collection('chatRooms').doc(groupId).update({ lastMessage: update })
    }

    async sendMessage(obj){
        let {messageText, groupId, attachment,createdAt, userId} = obj
        if (!messageText) return
        const chatId = uuid()
        const chatRoomRef = await db.collection('chatRooms').doc(groupId).collection('messages')
        const newMessage = await chatRoomRef.add({
            messageText: messageText,
            attachment: attachment || {},
            createdAt,
            userId,
            chatId: chatId
        })
        await this.updateLastMessage(groupId, {messageText, attachment: attachment || {}, createdAt, userId, chatId})
    }

    async getMessages(groupId, onSnapShotUpdate=()=>{}){
        let count = 0
        if (!groupId) return
        const messages = []
        const dbMessages = db.collection('chatRooms').doc(groupId).collection('messages')
        const unsub = await  dbMessages.onSnapshot(snapShot=>{
            const messages = []
                snapShot.docChanges().forEach(x=>{
                    if (x.type === 'added') {
                        const data = x.doc.data()
                        if (data.createdAt) data.createdAt = data.createdAt.toDate()
                    }
                })
            if (messages.length){
                onSnapShotUpdate({groupId ,data: messages})
            }
        })
        return messages
    }

    async getGroupMessagesByUserId(userId){
        if (!userId) return []
        const groupChatRooms = await db.collection('chatRooms').where(`users.${userId}`, '==', true).get()
        const groupChatList = []
        groupChatRooms.forEach((x)=>{
            let data =  x.data()
            if( data?.lastMessage?.createdAt ) data.lastMessage.createdAt = data?.lastMessage?.createdAt.toDate()
            groupChatList.push(data)
        })
        return groupChatList
    }

    getSingleGroupMessages(groupId, onSnapShotUpdate){
        if (!groupId) return []
        const groupChatRooms = db.collection('chatRooms').doc(groupId).collection('messages')
        const unsub = groupChatRooms.onSnapshot(snapShot=>{
            const messages = []
            snapShot.docChanges().forEach(x=>{
                if (x.type === 'added') {
                    const data = x.doc.data()
                    if (data.createdAt) data.createdAt = data.createdAt.toDate()
                    messages.push(data)
                }
            })
            if (messages.length){
                onSnapShotUpdate({groupId, data: messages})
            }
        })

        return unsub // completed
    }

    setTextMessageListeners( {userId,onAddChatRooms, onUpdateRooms, onCompletLoading }){
        if (!userId) return []
        const chatRooms = db.collection('chatRooms').where(`users.${userId}`, '==', true)
        let loading = true
        const unsub = chatRooms.onSnapshot(snapShot=>{
            const chatRooms = []
            const updatedChatRooms = []
            snapShot.docChanges().forEach(x=>{
                if (x.type === 'added') {
                    const data = x.doc.data()
                    if (data.createdAt) data.createdAt = data.createdAt.toDate()
                    if (data?.lastMessage?.createdAt) data.lastMessage.createdAt = data.lastMessage.createdAt.toDate()
                    chatRooms.push(data)
                }
                if (x.type === 'modified'){
                    const data = x.doc.data()
                    if (data.createdAt) data.createdAt = data.createdAt.toDate()
                    if (data?.lastMessage?.createdAt) data.lastMessage.createdAt = data.lastMessage.createdAt.toDate()
                    updatedChatRooms.push(data)
                }
            })
            if (updatedChatRooms.length){
                onUpdateRooms({ updatedChatRooms })
            }
            else if (chatRooms.length){
                let groupId;
                if (chatRooms[0]?.groupId)groupId = chatRooms[0]?.groupId
                else groupId = ''
                onAddChatRooms({groupId, chatRooms})
            }
            else if (loading){
                loading = false
                onCompletLoading()
            }

        })

        return unsub
    }

    async sendFirstMessage(props){
        let {  users={}, lastMessage, message, usersData, attachment, onLoadingDone } = props
        const { messageText, createdAt, userId } = message
        const groupId = uuid()
        const chatRooms = db.collection('chatRooms')
        const { exist, existingChatRoom} = await this._checkIfGroupExist(Object.keys(users))
        if (exist) {
            let {groupId: existingGroupId} = existingChatRoom
            await this.sendMessage({ groupId: existingGroupId, messageText, createdAt, userId, attachment })
            onLoadingDone()
            return { newChat: false, groupId: existingGroupId}
        }
        else {
            const chatId = uuid()
            await chatRooms.doc(groupId).set({
            createdAt: new Date(),
            isBlocked: false,
            groupId,
                lastMessage: {
                    messageText,
                    userId,
                    createdAt,
                    chatId
                },
                users,
                usersData
            })
            await chatRooms.doc(groupId).collection('messages').add({
                messageText, createdAt, userId, attachment, chatId: chatId
            })
            onLoadingDone()
            return { newChat: true, groupId }
        }
    }

    async _checkIfGroupExist(users=[]){
        if (users.length !== 2) return // only support two people chat
        const groupsDb = await db.collection('chatRooms')
            .where(`users.${users[0]}`, '==',true)
            .where(`users.${users[1]}`, '==',true).get()
        let data = []
        groupsDb.forEach(x=>{
            const xData = x.data()
            data.push(xData)
        })
        return {exist: data?.length > 0 ? true : false, existingChatRoom: data[0]}
    }
}

export default new FirebaseHelper2()
