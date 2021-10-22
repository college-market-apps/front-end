import React,{useState, useEffect} from 'react'
import {View, Text, TouchableOpacity,StyleSheet, SafeAreaView,TextInput, KeyboardAvoidingView, ScrollView, Alert} from 'react-native'
import Modal from './Modal'
import FirebaseHelper2 from "../../helpers/FirebaseHelper";
import { useNavigation } from '@react-navigation/native';
import Progress from '../components/Progress'
import { useDispatch, useSelector } from 'react-redux';
import { createShoppingCartWithProductDb, addProductToShoppingCart } from '../../store/reducers/shoppingcart'

function mapState(state){

    function prouctInGroupChat(sellerId, productId){
        const { products } = state.ShoppingCart.shoppingCarts.find(x=>x?.users?.find(y=>String(y.id) === String(sellerId))) || {}
        if (!products) return false
        const exist = products.find(x=>String(x.id)===String(productId))
        return !!exist
    }

    return {
        prouctInGroupChat: (sellerId, productId)=>prouctInGroupChat(sellerId, productId),
    }
}

export default function SendMessage({onClose, visible, getSendData, productId, sellerId }){
    const dispatch = useDispatch()
    const { prouctInGroupChat } = useSelector(mapState)
    const productInChat = prouctInGroupChat(sellerId, productId)
    const [value,setValue] = useState('')
    const [text,setText] = useState('')
    const [selected,setSelected] = useState(0)
    const [loading, setLoading] = useState(false)
    const valueOptions ={
        '1': "Hello I'm intrested in your product is it still avalible?",
        '2':'Is this product still Avalible?',
    }

    useEffect(()=>{},[productId])

    const navigation = useNavigation()
    function onChange(type){
        switch (type) {
            case 3 :{
                setValue(text)
                setSelected(3)
            }
            default: {
                if (valueOptions[type]) {
                    setValue(valueOptions[String(type)])
                    setSelected(type)
                }
            }
        }
    }

    function onLoadingDone(){
        setLoading(true)
    }

    async function onSendMessage(){
        if (productInChat){
            Alert.alert( "Product is in a chat room", "Would you like to navigate to your messages?",
            [{
                text: "Yes",
                onPress: () => {
                    onClose()
                    navigation.navigate("MessagesStack")
                }
            },
            {
                text: "No",
                onPress: onClose,
                style: "cancel"
            }]);
            return
        }
        setLoading(true)
        if (!selected) {
            setLoading(false)
            return alert('Please select a message.')
        }
        const sendData = getSendData()
        sendData.message = { messageText: value, createdAt: new Date(), userId: sendData.userId}
        const  { newChat, groupId } = await FirebaseHelper2.sendFirstMessage({ ...sendData, onLoadingDone })
        // if not exist create messages and add message_product
        if (newChat){
            dispatch(createShoppingCartWithProductDb(groupId, sellerId, productId))
        }else{
            // not new product -> add product to messages_products
            dispatch(addProductToShoppingCart(groupId, productId))
        }
        setLoading(false)
        onClose()
    }

    function isSelected(param){
        return param === selected ? styles.selected : styles.notSelected
    }

    return (
        <KeyboardAvoidingView>
        <Modal visible={visible} modalStyle={styles.modal} innerViewStyle={styles.innerViewStyle} onClose={onClose}>
            {
                loading ? (
                    <Progress />
                ) : (
                    <ScrollView style={styles.scrollArea}>
                <View style={styles.actionButton}>
                    <TouchableOpacity onPress={onClose} style={styles.btns}>
                        <Text>Close</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.selectMessageType}>Select a message or send your own</Text>
                <View style={styles.selectMessage}>
                    <TouchableOpacity style={styles.option} onPress={()=>onChange(1)}>
                        <Text style={styles.isAvalible}>Hello I'm intrested in your product is it still avalible?</Text>
                        <View style={[isSelected(1)]}></View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.option}
                        onPress={()=>onChange(2)}
                    >
                        <Text style={styles.isAvalible}>Is this product still Avalible?</Text>
                        <View style={[isSelected(2)]}></View>
                    </TouchableOpacity>
                    <View style={styles.messageInput}>
                        <TouchableOpacity style={styles.option} onPress={()=>onChange(3)}>
                            <View style={styles.inputView}>
                                <TextInput placeholder='add your message' multiline={true}style={styles.input} value={text} onChangeText={setText}/>
                            </View>
                            <View style={[isSelected(3),{marginBottom:'auto'}]}></View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.send} onPress={onSendMessage}>
                        <Text style={styles.sendText} >Send</Text>
                    </TouchableOpacity>
                <View style={{height: 400}}></View>
                </View>
            </ScrollView>
                )
            }
        </Modal>
        </KeyboardAvoidingView>
    )
}

const styles= StyleSheet.create({
    innerViewStyle:{
        height: '70%',
        marginTop:'auto',
        width:'100%',
        shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor:'white',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    },
    modal:{
        width: '100%',
        height:'100%',
    },
    scrollArea:{
        height: '10%',
    },
    option:{
        width:'90%',
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 10
    },
    selected:{
        height: 20,
        width: 20,
        borderRadius: 100,
        borderWidth: 3,
        borderColor: 'black',
        backgroundColor:'green',
    },
    notSelected:{
        height: 20,
        width: 20,
        borderRadius: 100,
        borderWidth: 3,
        borderColor: 'black',
        backgroundColor:'#E9EBEF'
    },
    selectMessageType:{
        marginTop: 20,
        marginBottom:20,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '90%',
        textAlign:'center',
        fontSize: 20,
        fontWeight:'600',
    },
    actionButton:{
        width:'90%',
        flexDirection:'row',
        marginRight:'auto',
        marginLeft:'auto',
        marginTop:20,
    },
    btns:{
        height: 30,
        width: 120,
        backgroundColor:'lightblue',
        justifyContent:'center',
        alignItems: 'center',
        borderRadius: 5,
        marginLeft:'auto'
    },
    selectMessage:{
        width:'100%',
        // height: 100,
        marginTop: 10,
        alignItems: 'center',
    },
    isAvalible:{
        width: '90%'
    },
    messageInput:{
        width:'100%',
        minHeight: 30,
        maxHeight: 200,
        alignItems: 'center',
    },
    inputView:{
        width: '90%',
        minHeight: 40,
        backgroundColor:'#E9EBEF',
        borderRadius: 5,
        justifyContent: 'center',
    },
    input:{
        padding: 10,
    },
    send:{
        height: 40,
        width: 150,
        backgroundColor:'green',
        marginTop: 100,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendText:{
        color: 'white',
        fontSize: 16
    }
})
