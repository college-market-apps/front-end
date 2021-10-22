import React from 'react'
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions} from 'react-native'
import {  presignedGETURL } from '../../../helpers/S3'
const { width, height } = Dimensions.get('screen')


function SoldProductsItem({item, index, onPressItem, currentUserId}){
    const { purchase, title, sold, images, tags, id: productId } = item
    const { user } = purchase || { user: { } }
    const image = images[0]
    let itemUri = image.path
    if (image.isAWS) itemUri = presignedGETURL(image.path)
    const isEven = index %2===0
    return (
        <View style={styles.shoppingItems}>
            <TouchableOpacity onPress={()=>onPressItem({user,productId, item})}>
                <Image source={{uri: itemUri}} style={styles.itemImage}/>
            </TouchableOpacity>
            <View style={[isEven? {marginLeft: 10} : {marginRight: 10}]}>
                <View style={styles.itemStatus}>
                    <Image source={{uri: user.profileImage }} style={styles.profileImageProduct}/>
                    <Text style={styles.name}>{user.id === currentUserId ? 'You': user.name}</Text>
                </View>
                <Text style={styles.title}>{title}</Text>
                <Text style={[styles.isSold, sold? {color: 'green'}: {color:'blue'}]}>{sold? 'Sold' : 'Pennding'}</Text>
            </View>
        </View>
    )
}

export default function SoldProductsDisplay({ soldProducts, currentUserId, onPressItem }){

    function renderItem({ item, index }){
        return (
            <SoldProductsItem
                item={item}
                currentUserId={currentUserId}
                onPressItem={()=>console.log('ITEM PRESSED')}
                index={index}
            />
        )
    }

    return (
        <View style={styles.sellectedScreen}>
            <FlatList
                data={soldProducts} // screens
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
                    <Text>No products sold yet.</Text>
                </View>)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    shoppingItems:{
        width: '47%',
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
    },
    empty:{
        height: height *.7,
        alignItems: 'center',
        marginTop: 30
    }
})
