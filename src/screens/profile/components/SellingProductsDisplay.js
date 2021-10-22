import React from 'react'
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native'
import {  presignedGETURL } from '../../../helpers/S3'
const { width, height } = Dimensions.get('screen')

function SellingProductItem({item, index, onPressItem, onNavigateToProduct}){
        const { title, sold, images, id: productId, price, createdAt } = item
        const image = images[0]
        let itemUri = image.path
        if (image.isAWS) itemUri = presignedGETURL(image.path)
        const isEven = index %2===0
        return (
            <View style={styles.shoppingItems}>
                <TouchableOpacity onPress={onNavigateToProduct}>
                    <Image source={{uri: itemUri}} style={styles.itemImage}/>
                </TouchableOpacity>
                <View style={[isEven? {marginLeft: 10} : {marginRight: 10}]}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={[styles.isSold, { color:'blue' }]}>${price}</Text>
                </View>
            </View>
        )
    }

export default function SellingProductsDisplay({ sellingProducts, currentUserId, onPressItem, onNavigateToProduct }){
    function renderItem({item, index}){
        return(
            <SellingProductItem
                item={item}
                currentUserId={currentUserId}
                onPressItem={()=>console.log('ITEM PRESSED')}
                onNavigateToProduct={()=>onNavigateToProduct(item.id)}
                index={index}
            />
        )
    }
    return (
        <View style={styles.sellectedScreen}>
            <FlatList
                data={sellingProducts} // screens
                renderItem={renderItem}
                columnWrapperStyle={{
                    justifyContent: "space-between",
                    marginBottom: 10,
                    marginTop: 10,
                }}
                numColumns={2}
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={(
                <View style={styles.empty}>
                    <Text >No posted products avalible.</Text>
                </View>)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
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
        height:'100%'
    },
    empty:{
        height: height *.7,
        alignItems: 'center',
        marginTop: 30
    }
})
