import React, { useLayoutEffect, useEffect,useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Dimensions, ScrollView } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
moment().format()
import {  presignedGETURL } from '../../helpers/S3'
import { fetchUserProducts } from '../../store/reducers/user'
import SoldProductsDisplay from './components/SoldProductsDisplay'
import SellingProductsDisplay from './components/SellingProductsDisplay'
import PurchasedItemsDisplay from './components/PurchasedItemsDisplay'
import SwipeScreen from './components/SwipeScreen'
import { getProfilePageOpendStatus, markProfileAsOpened } from './LocalStorage'
import { auth } from '../../../firebase'
import { logOut } from '../../store/reducers/auth'

const { width } = Dimensions.get('screen')
export default function ProfileScreen({ navigation }){
    const {profileImage, name, createdAt, soldProducts, sellingProducts, purchasedProducts, currentUserId, school } = useSelector(mapState)
    const [currentScreen, setCurrentScreen] = useState(0)
    const [mounted, setMounted] = useState(false)
    const [visibleSwipeScreen, setVisibleSwipeScreen] = useState(false)
    const dispatch = useDispatch()

    useLayoutEffect(()=>{
        navigation.setOptions({
            title:'Your Profile',
            // headerRight: ()=>{
            //     return (
            //         <TouchableOpacity onPress={()=>navigation.navigate('Settings Screen')}>
            //             <Feather name='settings' style={styles.settingsIcon} />
            //         </TouchableOpacity>
            //     )
            // },
        })
    },[])

    useEffect(()=>{
        if (!mounted){
            dispatch(fetchUserProducts())
            setMounted(true)
        }
        async function func(){
            const markedAsOpen = await getProfilePageOpendStatus()
            if (!markedAsOpen) setVisibleSwipeScreen(true)
        }
        func()

    },[ ])

    async function onSignOut(){
        try {
            const data = await auth.signOut()
            if (!data) dispatch(logOut())

        } catch (error) {
            console.log('Error loginOut-->', error)
        }
    }

    function isSellected(selected){
        return selected === currentScreen ? styles.selected : {}
    }

    function renderHeader(){
        return (
            <View >
                <View style={styles.profile}>
                    <Image style={styles.profileImage} source={{uri: profileImage}}/>
                    <View style={styles.profileDescription}>
                        <Text style={styles.name}>{name}</Text>
                        <Text style={styles.date}>
                            <Text style={{fontWeight:'600'}}>School: </Text>
                            {school.name}
                        </Text>
                        <Text style={styles.date}>
                            <Text style={{fontWeight:'600'}}>Date Joined: </Text>
                            {` ${moment(new Date(createdAt)).format("MMM Do YYYY")}`}
                        </Text>
                        <TouchableOpacity style={styles.edit} onPress={onSignOut}>
                            <Text>Sign Out</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.displayCategory}>
                    <Text style={[styles.headerText,isSellected(0)]}>Selling</Text>
                    <Text style={[styles.headerText,isSellected(1)]}>Sold</Text>
                    <Text style={[styles.headerText,isSellected(2)]}>Purchased</Text>
                </View>
            </View>
        )
    }

    function onNavigateToProduct(productId){
        navigation.navigate('ProductsStack',{
            screen: "Single Product",
            params:{
                productId
            }
        })
    }

    async function onCloseVisibleSwipe(){
        await markProfileAsOpened()
        setVisibleSwipeScreen(false)
    }

    return (
        <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
            {renderHeader()}
            <ScrollView
                pagingEnabled
                scrollEnabled
                scrollEventThrottle={6}
                decelerationRate={"fast"}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                onScrollEndDrag={(e)=>{
                    const {x: targetX} = e.nativeEvent.targetContentOffset
                    const curScrn = Math.floor((targetX||1 )/width)
                    setCurrentScreen(curScrn)
                }}
            >
                <SellingProductsDisplay
                    sellingProducts={sellingProducts}
                    currentUserId={currentUserId}
                    onPressItem={()=>{}}
                    onNavigateToProduct={onNavigateToProduct}
                />
                <SoldProductsDisplay
                    soldProducts={soldProducts}
                    currentUserId={currentUserId}
                    onPressItem={()=>{}}
                />
                <PurchasedItemsDisplay
                    purchasedProducts={purchasedProducts}
                    currentUserId={currentUserId}
                    onPressItem={()=>{}}
                />
            </ScrollView>
            <View style={styles.screens}>
            </View>
            {visibleSwipeScreen && <SwipeScreen visible={visibleSwipeScreen} onClose={onCloseVisibleSwipe} />}
        </ScrollView>
    )
}

function mapState(state){
    return {
        currentUserId: state.User.id,
        profileImage: state.User?.profileImage,
        name: state.User.name,
        createdAt: state.User.createdAt,
        soldProducts: state.User.soldProducts,
        sellingProducts:state.User.sellingProducts,
        purchasedProducts:state.User.purchasedProducts,
        school: state.User.schools[0]
    }
}

const styles = StyleSheet.create({
    page:{
        width: '100%',
        height: '100%',
        marginLeft:'auto',
        marginRight:'auto',
    },
    settingsIcon:{
        fontSize: 20,
        marginRight: 20
    },
    profile:{
        marginTop: 10,
        width: '95%',
        flexDirection:'row',
        marginRight:'auto',
        marginLeft:'auto'
    },
    profileImage:{
        height: 120,
        width: 120,
        backgroundColor:'#ededed',
        borderRadius: 100
    },
    profileDescription:{
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        flex: 1,
    },
    name:{
        fontSize: 20,
        fontWeight: '600'
    },
    screens:{
        height: '100%',
        flex: 1,
        marginTop: 10
    },
    edit:{
        height: 30,
        width: 150,
        backgroundColor: 'lightgrey',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 'auto',
        marginLeft:'auto',
        marginRight:'auto',
    },
    displayCategory:{
        flexDirection:'row',
        justifyContent: 'space-evenly',
        marginTop: 40
    },

    // Selling ITme
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
    headerText:{
        fontSize: 17
    },
    selected:{
        color: 'green'
    },
    name:{
        fontSize: 16,
        marginLeft: 10,
        fontWeight:'600'
    },
    date:{
        fontSize: 12,
        marginLeft: 10
    },
    profileImageProduct:{
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
    sellectedScreen:{
        width,
        flex: 1,
        // backgroundColor:'red'
    },
    empty:{
        marginLeft:'auto',
        marginRight:'auto',
        marginTop: 20
    }
})
