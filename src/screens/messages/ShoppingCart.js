import React,{ useLayoutEffect, useState, useEffect } from 'react'
import {View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions} from 'react-native'
import { useSelector, useDispatch} from 'react-redux'
import { presignedGETURL } from '../../helpers/S3'
import Feather from "react-native-vector-icons/Feather"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { ShoppingCartHeaderRight } from '../components/Headers'
import ShoppingCartSettings from './components/ShoppingCartSettings'
import MarkAsSold from './components/MarkAsSold'
import { fetchShoppingCart } from '../../store/reducers/shoppingcart'

import { markeProductAsSold } from '../../store/reducers/shoppingcart'

const { width } = Dimensions.get('window')
function mapState(state){
    return {
        groupMessages: state.ShoppingCart.shoppingCarts,
        currentUserId: state.User.id,
        getGroupMessages:(groupId)=>state.ShoppingCart.shoppingCarts.find(x=>x.groupId === groupId),
    }
}

export default function ShoppingCart({visible,onClose, route, navigation}){
    const dispatch = useDispatch()
    const { groupId } = route.params
    const { getGroupMessages, currentUserId } = useSelector(mapState)
    const { products, users, isBlocked } = getGroupMessages(groupId) || { products: [], users:[], isBlocked: false }
    const [visibleSettings, setVisibleSettings] = useState(false)
    const [visibleMarkAsSold, setVisibleMarkAsSold] = useState(false)
    const [visibleDashBoard, setVisibleDashBord] = useState(false)
    const [sellingProductId, setSellingProductId] = useState(0)
    const [selectedScreen, setSelectedScreen] = useState('pennding')
    const [sellingItem, setSellingItem] = useState({})
    const [settings, setSettings] = useState({
        sortBy: 'sold',
        filterBy: 'all'
    })

    useLayoutEffect(()=>{
        navigation.setOptions({
            headerRight:()=>(
                <TouchableOpacity onPress={()=>setVisibleSettings(true)}>
                    <Feather name="menu" style={styles.menu}/>
                </TouchableOpacity>
            ),
            headerLeftContainerStyle: { width: 0 },
            headerRightContainerStyle: { width: 100 },
        })
    },[  ])

    useEffect(()=>{
        dispatch(fetchShoppingCart())
    },[])

    function isSelected(name, settingType){
        if (settingType === 'sortBy') return name === settings.sortBy
        else if (settingType === 'filterBy') return name === settings.filterBy
        else return false
    }

    function onChangeSort(name){
        setSettings({...settings, sortBy: name})
    }

    function onChangeFilter(name){
        setSettings({...settings, filterBy: name})
    }

    function onPressItem({ user, productId, item}){
        const { sold } = item
        const isUsersProduct = user.id === currentUserId
        if (!isUsersProduct) return navigation.navigate("Single Product", {productId})
        setSellingProductId(productId)
        setSellingItem(item)
        setVisibleMarkAsSold(true)
    }

    function onSellProduct(){
        if (!sellingProductId) return alert('there was an error selling your product.')
        const vewingUser = users.find(x=>x.id !== currentUserId)
        dispatch(markeProductAsSold({ productId: sellingProductId, purchaserUserId: vewingUser.id }))
        setSellingProductId(0)
        setVisibleMarkAsSold(false)
    }

    function ShoppingItem({item, index}){
        const { user, title, sold, images, tags, id: productId } = item
        let profileUri = user.profileImage
        const image = images[0]
        let itemUri = images[0].path
        if (!user.profileImage.includes('://')) profileUri = presignedGETURL(user.profileImage)
        if (image.isAWS) itemUri = presignedGETURL(image.path)
        const isEven = index %2===0
        return (
            <View style={styles.shoppingItems}>
                <TouchableOpacity onPress={()=>onPressItem({user,productId, item})}>
                    <Image source={{uri: itemUri}} style={styles.itemImage}/>
                </TouchableOpacity>
                <View style={[isEven? {marginLeft: 10} : {marginRight: 10}]}>
                    <View style={styles.itemStatus}>
                        <Image source={{uri: profileUri}} style={styles.profileImage}/>
                        <Text style={styles.name}>{user.id === currentUserId ? 'You': user.name}</Text>
                    </View>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={[styles.isSold, sold? {color: 'green'}: {color:'blue'}]}>{sold? 'Sold' : 'Pennding'}</Text>
                </View>
            </View>
        )
    }

    function compareChars(a,b){
        if(a < b) return -1
        if(a > b) return 1
        return 0;
    }

    function sortItems(list){
        list = [...list]
        const { filterBy, sortBy } = settings
        // filter
        let filtered;
        if (filterBy === 'all') filtered = list
        else if (filterBy === 'pennding') filtered = list.filter(x=>!x.sold)
        else if (filterBy === 'sold') filtered = list.filter(x=>x.sold)
        else filtered = list

        // sort
        let sorted
        if ( sortBy === 'createdAt') sorted = [...filtered].sort((a,b)=>Date.parse(b.createdAt) - Date.parse(a.createdAt) )
        else if ( sortBy === 'title') sorted = [...filtered].sort((a,b)=>compareChars(a.title,b.title))
        else if ( sortBy === 'description') sorted = [...filtered].sort((a,b)=>compareChars(a.description,b.description))
        else if ( sortBy === 'price') sorted = [...filtered].sort((a,b)=>b.price - a.price)
        else if (sortBy === 'users') sorted = [...filtered].sort((a,b)=>compareChars(a.user.name, b.user.name))
        else if (sortBy === 'sold') sorted = [...filtered].sort((a, b)=>{
            if (b.sold && a.sold) return 0
            else if (!b.sold && a.sold) return 1
            else return -1
        })

        // return
        return sorted || filtered
    }


    function renderRow({item}){
        const noProductText = selectedScreen ==='pennding' ? "All products have been sold." : "No products have been sold yet."
        return (
            <FlatList
                data={item}
                renderItem={ShoppingItem}
                snapToAlignment="start"
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => String(item.id)}
                numColumns={2}
                contentContainerStyle={{
                    width,
                    height:'100%',
                }}
                columnWrapperStyle={{
                    justifyContent: "space-between",
                    marginBottom: 10,
                    marginTop: 10,
                }}
                ListEmptyComponent={<Text style={styles.noProducts}>{noProductText}</Text>}
            />
        )
    }
    const sortedList = sortItems(products || [])
    return (
        <View >
            <FlatList
                data={sortedList}
                renderItem={ShoppingItem}
                snapToAlignment="start"
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => String(item.id)}
                numColumns={2}
                contentContainerStyle={{
                    width,
                    height:'100%',
                }}
                columnWrapperStyle={{
                    justifyContent: "space-between",
                    marginBottom: 10,
                    marginTop: 10,
                }}
                ListEmptyComponent={<Text style={styles.noProducts}>{'No products to show you.'}</Text>}
            />

            {visibleSettings && <ShoppingCartSettings visible={visibleSettings} onClose={()=>setVisibleSettings(false)} isSelected={isSelected} onChangeSort={onChangeSort} onChangeFilter={onChangeFilter}/>}

            {visibleMarkAsSold && <MarkAsSold visible={visibleMarkAsSold} onClose={()=>{
                setSellingProductId(0)
                setVisibleMarkAsSold(false)
            }} onSellProduct={onSellProduct} sellingItem={sellingItem} uri={sellingItem?.images[0]?.path} />}
        </View>
    )
}

const styles = StyleSheet.create({
    noProducts:{
        marginLeft:'auto',
        marginRight:'auto',
        marginTop: 20,
        fontWeight: '600'
    },
    page:{
        flexDirection:'row',
        flexWrap:'wrap',
        justifyContent: 'space-between',
    },
    pageOptions:{
        flexDirection:'row',
        width: '100%',
        height: 50,
        justifyContent: 'space-between',
        marginLeft:'auto',
        marginRight: 'auto',
        // marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 7,
        backgroundColor:'#24aa4a'
    },
    marginRight:{
        marginRight: 50
    },
    isSelected:{borderBottomWidth: 1, borderColor: 'red', paddingBottom: 3},
    menu:{
        fontSize: 20,
        marginRight: 10
    },
    shoppingItems:{
        width: '48%',
        minHeight: 200,
    },
    itemImage:{
        height: 200,
        width: '100%',

    },
    itemStatus:{
        flexDirection:'row',
        alignItems: 'center',
        marginTop: 5
    },
    name:{
        fontSize: 16,
        marginLeft: 10
    },
    profileImage:{
        height: 40,
        width: 40,
        borderRadius: 100
    },
    title:{
        marginTop: 10,
    },
    isSold:{
        fontSize: 16
    },
})
