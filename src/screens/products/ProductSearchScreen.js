import React, { useLayoutEffect, useState, useEffect } from 'react'
import {View, Text, FlatList, StyleSheet} from 'react-native'
import { ProductsHeader, HeaderStyles} from '../components/Headers'
import { useSelector, useDispatch, batch } from 'react-redux'
import ProductItem from "./components/ProductItem";
import { searchProductByTag, onChangeSearch } from '../../store/reducers/search'

export default function ProductSearchScreen({ navigation,  route }){
    const [mounted, setMounted] = useState(false)
    const { products, search } = useSelector(mapState)
    const { tagName: initSearch, nonSearch } = route?.params || {}
    const [searchable, setSearchable] = useState(!nonSearch)
    const dispatch = useDispatch()
    useLayoutEffect(()=>{
        navigation.setOptions({
            headerTitle:`${search || "Search"}`,
            headerStyle: HeaderStyles.Header,
            headerLeftContainerStyle: { width: 0 },
            headerRightContainerStyle: { width: 0 },
            headerTitleContainerStyle: {}
        })
    },[ products ])

    useEffect(()=>{
        if (initSearch) {
            onSearch(initSearch)
        }
    },[ ])

    function onSearch(search){
        if (!searchable) setSearchable(true)
        batch(()=>{
            dispatch(onChangeSearch(search))
            dispatch(searchProductByTag(search.toLowerCase()))
        })
    }

    function renderItem({ item, index }){
        const { images, description, price, title, id } = item
        const image = images.length ? images[0].path : ''
        const lastIsOdd = index === products.length - 1 && products.length % 2 === 1
        return (
            <ProductItem
                title={title}
                onNavigate={()=>navigation.push('Single Product',{ productId: id })}
                image={image}
                price={price}
                isOdd={index % 2 === 1}
                lastIsOdd={lastIsOdd}
            />
        )
    }

    return (
        <View style={styles.page}>
            <FlatList
                style={styles.flatList}
                ListHeaderComponent={<ProductsHeader onSearch={onSearch} />}
                renderItem={renderItem}
                data={products}
                columnWrapperStyle={{
                    justifyContent: "space-between",
                    marginBottom: 10,
                    marginTop: 10,
                }}
                keyExtractor={item => "_" + item.id}
                numColumns={2}
                ListEmptyComponent={<View style={styles.noProducts}><Text >{searchable ? `No products found for ${search} :(`: 'search for a product'}</Text></View>}
            />
        </View>
    )
}

function mapState(state){
    return {
        products: state.Search.products,
        search: state.Search.search
    }
}

const styles = StyleSheet.create({
    page:{
        // flexDirection:'column',
        // flexWrap:'wrap',
        width:'100%',
        height:'100%',

    },
    flatList:{
        height: '100%',
        width:'100%',
        marginBottom: 20
    },
    noProducts:{
        marginTop: 10,
        marginRight:'auto',
        marginLeft:'auto',
    }
})
