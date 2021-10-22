import React, { useState, useEffect, useLayoutEffect } from "react";
import {
    View,
    FlatList,
    Text,
    StyleSheet,
    Dimensions,
    TextInput,
    TouchableOpacity
} from "react-native";
import PurchaseItem from '../components/PurchaseItem'

import { shadow } from "../../shared/styles";
import ProductItem from "./components/ProductItem";
import Fontisto from "react-native-vector-icons/Fontisto";
import CircleProgress from '../components/Progress'
import { ProductsHeader, HeaderStyles} from '../components/Headers'

import {connect} from 'react-redux'
import {getUser} from '../../store/reducers/user'
import { useDispatch } from 'react-redux'
import { searchProductByTag } from '../../store/reducers/search'
import { fetchShoppingCart } from '../../store/reducers/shoppingcart'

function Products(props) {
    const dispatch = useDispatch()
    const { products, search, navigation, fetchShoppingCart } = props;
    const [refreshing, setRefreshing] = useState(false);

    useEffect(()=>{
        fetchShoppingCart()
    },[])

    // useLayoutEffect(()=>{
    //     navigation.setOptions({
    //         headerTitle:()=>{
    //             return (
    //                 <ProductsHeader
    //                     onSearch={onSearch}

    //                 />
    //             )
    //         },
    //         headerStyle: HeaderStyles.Header,
    //         headerLeftContainerStyle: { width: 0 },
    //         headerRightContainerStyle: { width: 0 },
    //         headerTitleContainerStyle: {}
    //     })
    // },[ search ])

    function onRefresh() {
        setRefreshing(true);
        // Fetch Database here
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }

    function onSearch(){
        dispatch(searchProductByTag(search?.toLowerCase()))
        navigation.push('Product Search',{ search })
    }

    return (
        <View style={styles.page} behavior="padding">
            <FlatList
                style={styles.flatList}
                ListFooterComponent={
                    <View style={{ height: 0, marginBottom: 80 }}></View>
                }
                data={products}
                renderItem={({ item, index }) => {
                    const { images, description, price, title, id } = item
                    const image = images.length ? images[0].path : ''
                    const lastIsOdd = index === products.length - 1 && products.length % 2 === 1
                    return (
                        <ProductItem
                            title={title}
                            onNavigate={()=> navigation.push('Single Product',{ productId: id })}
                            image={image}
                            price={price}
                            isOdd={index % 2 === 1}
                            lastIsOdd={lastIsOdd}
                        />
                    )
                }}
                columnWrapperStyle={{
                    justifyContent: "space-between",
                    marginBottom: 10,
                    marginTop: 10,
                }}
                onRefresh={onRefresh}
                refreshing={refreshing}
                key={"_"}
                keyExtractor={item => "_" + item.id}
                numColumns={2}
                ListEmptyComponent={<Text styles={styles.noProducts}>No products found for your school :(</Text>}
            />
            <TouchableOpacity style={styles.searchButton} onPress={()=>navigation.push('Product Search',{nonSearch: true})}>
                <Fontisto style={styles.icon} name="search"/>
            </TouchableOpacity>
        </View>
    );
}

const mapState = (state)=>{
    return {
        products: state.Products.products,
        search: state.Search.search,
    }
}

const mapDispatch = (dispatch)=>{
    return {
        getUser: ()=>dispatch(getUser()),
        fetchShoppingCart:()=>dispatch(fetchShoppingCart())
    }
}

export default connect(mapState,mapDispatch)(Products)

const styles = StyleSheet.create({
    page: {
        height: "100%",
        width: "100%",
        backgroundColor: "white",
    },
    searchBar: {
        width: "100%",
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        ...shadow,
    },
    search: {
        width: "90%",
        marginLeft: 5,
    },
    noProducts:{
        marginTop: 10,
        marginLeft:'auto',
        marginRight:'auto',
    },
    searchButton:{
        height: 50,
        width: 50,
        backgroundColor:'white',
        justifyContent: 'center',
        alignItems: 'center',
        position:'absolute',
        bottom: 10,
        right: 10,
        borderRadius: 100,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    icon:{
        fontSize: 20
    }
});
