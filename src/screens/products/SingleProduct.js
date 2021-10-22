import React,{useEffect,useState,useLayoutEffect} from "react";
import { View,TouchableOpacity,Image, ScrollView, Text, StyleSheet } from "react-native";
import {connect} from 'react-redux'
import {shadow} from '../../shared/styles'
import moment from 'moment'
moment().format()
import {getAProduct} from '../../store/reducers/products'
import { likeAProduct, removeProductLike} from '../../store/reducers/likes'
import {useDispatch} from 'react-redux'
const profileImagePlaceHolder = 'https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg'

import SendMessage from "../components/SendMessage";
import Feather from "react-native-vector-icons/Feather"
import DisplayUser from '../components/DisplayUser'
import CircleProgress from '../components/Progress'
import SnapCarosel from '../components/SnapCarousel'
import Tags from './components/Tags'
import { HeaderDetail, ProductDescription, UserSellingProduct } from './components/SingleProductDetail'
import { presignedGETURL } from '../../helpers/S3'

function Divider(){
    return (
        <View style={styles.divider}></View>
    )
}
function SingleProduct(props) {
    const [isLiked, setLiked] = useState(false)
    const [visible,setVisible] = useState(false)
    const [viewUser,setViewUser] = useState(false)
    const [viewingProduct,setViewingProduct]  = useState({})
    const {route,user,products,fetchProduct, userId, likeAProduct, removeProductLike, productsLiked, navigation} = props
    const {title, description,price, sold, images, user:viewingUser,condition, tags} = viewingProduct
    let { productId } = route.params

    // useLayoutEffect(()=>{
    //     navigation.setOptions({
    //         headerTitle:``,
    //         headerLeftContainerStyle: { width: 0 },
    //         headerRightContainerStyle: { width: 0 },
    //         headerTitleContainerStyle: {}
    //     })
    // },[ ])

    useEffect(() => {
        let liked = productsLiked.some(x=> x.id=== productId)
        setLiked(liked)
        const prod = products.find(x=>x.id === productId)
        if (!prod) fetchProduct(productId)
        setViewingProduct(prod || {})
    }, [productsLiked,products,productId])

    function showToast(){
        Toast.show({
        text1: 'Hello',
        // text2: 'This is some something 👋',
        topOffset: 30
        });
    }

    function getSendData(){
        const { user: viewingUser } = viewingProduct
        return {
            users:{
                [user.id]: true,
                [viewingUser.id]: true
            },
            attachment:{
                type: 'product',
                id: productId,
                imageUrl: viewingProduct?.images[0]?.path || ''
            },
            userId: user.id,
            usersData:[
                {
                    id: user.id,
                    name: user.name,
                    profileImage: user.profileImage
                },
                {
                    id: viewingUser.id,
                    name: viewingUser.name,
                    profileImage: viewingUser.profileImage
                }
            ]
        }
    }

    function onLikeProduct(){
        if (!productId) return alert('there is an error liking this product')
        if (!isLiked){
            likeAProduct(productId)
        }else{
            removeProductLike(productId)
        }
    }

    function onPressTag(tagName){
        navigation.push("Product Search", { tagName })
    }

    if (!viewingProduct?.user || !viewingProduct) return <CircleProgress />

    return (
        <View style={styles.page}>
            <ScrollView contentContainerStyle={styles.product}>
                <SnapCarosel images={images} sold={sold}/>
                {/* <Image style={[styles.image,{width: '100%'}]} source={{ uri: images[0]?.path }}/> */}
                <Tags tags={tags} onPressTag={onPressTag}/>
                <HeaderDetail title={title} price={price} isLiked={isLiked} onLikeProduct={onLikeProduct} />
                <Divider />
                <ProductDescription description={description}/>
                <Divider />
                <UserSellingProduct
                    onPress={()=>setViewUser(true)}
                    createdAt={viewingUser.createdAt}
                    profileImage={viewingUser.profileImage}
                    name={viewingUser.name}
                />
            </ScrollView>
            {
                String(viewingUser.id) !== String(user.id) && !sold && (
                    <TouchableOpacity style={styles.buyBtns} onPress={()=>setVisible(true)}>
                        <Feather
                            name='send'
                            size={30}
                            color="black"
                        />
                    </TouchableOpacity>
                )
            }
            {
                viewUser && (
                    <DisplayUser
                        visible={viewUser}
                        onClose={()=>setViewUser(false)}
                        userId={viewingProduct?.user?.id}
                        sendScreen={'Single Product'}
                    />
                )
            }

            {!sold && (<SendMessage
                visible={visible}
                onClose={()=> setVisible(false)}
                getSendData={getSendData}
                productId={productId}
                sellerId={viewingUser.id}
            />)}
        </View>
    );
}

const mapState = (state)=>{
    return {
        productsLiked: state.Likes.products || [],
        products: state.Products.products || [],
        user: state.User,
    }
}

const mapDispatch = (dispatch)=>{
    return {
        fetchProduct:(productId)=>dispatch(getAProduct(productId)),
        likeAProduct: (id)=>dispatch(likeAProduct(id)),
        removeProductLike:(id)=>dispatch(removeProductLike(id))
    }
}

export default connect(mapState,mapDispatch)(SingleProduct)

const styles = StyleSheet.create({
    page:{
        width:'100%',
        height:'100%',
        backgroundColor:'white'
    },
    product:{
        width: '100%',
        display: "flex",
        justifyContent: "space-evenly",
        flexDirection:'row',
        flexWrap:'wrap',
        paddingBottom: 100,
    },
    images:{
        width: '100%',
        backgroundColor:'white',
        alignItems:'center',
        ...shadow,
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20,

    },
    image:{
        height: 300,
        width:'100%',
        backgroundColor:'lightgrey',
        borderBottomRightRadius:10,
        borderBottomLeftRadius:10,
    },
    divider:{
        height:.5,
        width:'100%',
        backgroundColor:'black',
        marginTop: 25,
        marginBottom:15
    },
    buyBtns:{
        height: 50,
        width: 50,
        backgroundColor:'lightblue',
        justifyContent:'center',
        alignItems:'center',
        borderRadius: 100,
        marginTop: 30,
        position:'absolute',
        bottom: 10,
        right: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
