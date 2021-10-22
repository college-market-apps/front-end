import React,{useState, useEffect} from 'react'
import {View, Text,Image,StyleSheet,TouchableOpacity, SafeAreaView,VirtualizedList, ScrollView, FlatList} from 'react-native'
import Modal from './Modal'
import {connect} from 'react-redux'
import {searchUser} from '../../store/reducers/search'
import moment from 'moment'
moment().format()
const defaultImage = 'https://humanitiesfutures.org/wp-content/themes/franklin-humanities/images/default-thumb.jpg'
import { presignedGETURL } from '../../helpers/S3'

import { useNavigation } from '@react-navigation/native';

function ItemSelling({item, navigation, onClose}){
    const {price, title,description,images,createdAt,id} = item
    function onPress(){
        navigation.push('Single Product', {productId : id})
        onClose()
    }
    console.log(images[0].isAWS)
    const uri = images[0]?.path?.includes('://') ? images[0]?.path : presignedGETURL(images[0]?.path)
    return (
        <TouchableOpacity style={s.sellingItem} onPress={onPress}>
            <Image style={s.image} source={{ uri }} />
            <View style={s.text}>
                <Text style={s.title} ellipsizeMode='tail' numberOfLines={1}>{title}</Text>
                <Text style={s.price}>${price}</Text>
                <Text style={s.date}>Posted: {moment(createdAt).fromNow()}</Text>
                <View style={s.divider}></View>
                <Text style={s.description} ellipsizeMode='tail' numberOfLines={2} >{description}</Text>
            </View>
        </TouchableOpacity>
    )
}


function DisplayUser({visible,onClose,userId,items,searchUser,searchedUser,sendData}){
    const navigation = useNavigation()
    const [loading,setLoading] = useState(false)
    useEffect(()=>{
        const user = searchedUser.find(x=>x.id=== userId)
        if (!user) searchUser(userId)
    },[])

    function renderButtons(){
        return (
            <View style={s.buttons}>
                <View style={[s.button, s.selectedBtn]}>
                    <Text>Products</Text>
                </View>
            </View>
        )
    }

    const user = searchedUser.find(x=>x.id=== userId)
    if (loading || !user){
        return <Text style={s.loading}>Loading...</Text>
    }

    function sortByDate(arr){
        return arr?.length ? arr.sort((a,b)=> {
            return Date.parse(b.createdAt) - Date.parse(a.createdAt)
        }) : []
    }

    const products = sortByDate(user.products)

    return (
        <Modal
            visible={visible}
            onClose={onClose}
            modalStyle={s.modalStyle}
            innerViewStyle={s.innerViewStyle}
        >
            <View style={s.page}>
                <View style={s.userView}>
                    <View style={s.user}>
                        <Image style={s.profileImage} source={{uri:user.profileImage}}/>
                        <View style={s.userDescription}>
                            <Text style={s.name}>{user.name}</Text>
                            <Text>{`Joind: ${moment(new Date(user.createdAt)).format("MMM Do YYYY")}`}</Text>
                        </View>
                    </View>
                    {renderButtons()}
                </View>
                <View style={s.sellingList}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        onPress={()=>console.log('presed flat list')}
                        renderItem={({item})=><ItemSelling item={item} navigation={navigation} onClose={onClose} />}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{
                            flexGrow: 1,
                        }}
                        data={products}
                        ListFooterComponent={<View style={{height: 400}}/>}
                    />
                </View>
            </View>
        </Modal>
    )
}

const mapState = (state)=>{
    return {
        products: state.Products.products,
        searchedUser: state.Search.users
    }
}

const mapDispatch = (dispatch)=>{
    return {
        searchUser:(userId)=>dispatch(searchUser(userId))
    }
}

export default connect(mapState, mapDispatch)(DisplayUser)
const s = StyleSheet.create({
    loading:{
        marginTop:'auto',
        marginBottom:'auto',
        marginRight:'auto',
        marginLeft:'auto',
    },
    modalStyle:{
        height: '100%%',
        width:'100%',
    },
    innerViewStyle:{
        height: '80%',
        backgroundColor:'white',
        marginTop:'auto',
        width:'100%',
        borderTopRightRadius:20,
        borderTopLeftRadius:20,
        alignItems: 'center',
    },
    page:{
        width:'100%',
        alignItems:'center'
    },
    userView:{
        // height:'100%',
        width:'100%',
        paddingTop: 20,
        alignItems:  'center',
        // backgroundColor:'yellow'
    },
    sellingView:{
        height:'100%',
        width:'100%',
        paddingTop: 20,
        alignItems:  'center',
        backgroundColor:'#E9EBEF'
    },
    user:{
        height: 100,
        width:'90%',
        flexDirection:'row',
        alignItems: 'center',
    },
    userDescription:{
        marginLeft: 10
    },
    name:{
        fontSize: 16,
        fontWeight:'600'
    },
    profileImage:{
        height: 100,
        width:100,
        borderRadius:100
    },
    buttons:{
        height: 50,
        width: '90%',
        // backgroundColor:'lightgrey',
        borderRadius: 5,
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    button:{
        height: '60%',
        minWidth: 100,
        paddingRight: 10,
        paddingLeft: 10,
        justifyContent:'center',
        alignItems: 'center',
    },
    selectedBtn:{
        borderBottomColor:'red',
        borderBottomWidth: 1
    },
    sellingItem:{
        height: 150,
        borderRadius: 10,
        backgroundColor:'#E9EBEF',
        marginBottom: 10,
        flexDirection:'row',
        alignItems: 'center',
    },
    sellingList:{
        width: '90%',
    },
    divider:{
        width: 100,
        height: 1,
        backgroundColor:'black',
        marginRight:'auto',
        marginBottom: 5,
        marginTop: 5
    },
    image:{
        height:120,
        width:120,
        borderWidth: 1,
        borderColor: 'black',
        marginLeft: 15,
        borderRadius: 5
    },
    text:{
        marginLeft: 10,
        marginRight: 10,
        height: 120,
        flex: 1,
        marginBottom: 5
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    price:{
        fontSize: 15,
        fontWeight:'600'
    },
    description:{
        fontSize: 16,
        flexWrap: 'wrap',
        // backgroundColor:'white',
        maxWidth: '95%'
    }
})
