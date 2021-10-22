import React from 'react'
import FontAwesome from "react-native-vector-icons/FontAwesome"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native'
import moment from 'moment'
moment().format()

export function HeaderDetail({price,title, school, isLiked, onLikeProduct}){
    return (
        <View style={styles.section}>
            <View style={styles.titleAndHeart}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity
                    style={styles.heart}
                    onPress={onLikeProduct}
                >
                    <FontAwesome
                        name={isLiked ? 'heart' : 'heart-o'}
                        color='red'
                        size={30}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.detail}>
                <Text style={styles.detailText}>Price: ${price}</Text>
                <Text style={styles.detailText}>School: MSU</Text>
                <Text style={styles.detailText}>Condition: Fair</Text>
            </View>
        </View>
    )
}

export function ProductDescription({description}){
    return (
        <View style={descStyle.descriptionView}>
            <Text style={descStyle.descriptionTitle}>Description:</Text>
            <Text style={descStyle.description}>{description}</Text>
        </View>
    )
}

export function UserSellingProduct({onPress, profileImage, name, createdAt}){
    return (
        <View style={userStyles.sellerContainer}>
            <Text style={userStyles.title}>Seller:</Text>
            <TouchableOpacity onPress={onPress} style={userStyles.seller}>
                <Image
                    style={userStyles.sellerImage}
                    source={{ uri: profileImage }}
                />
                <View style={userStyles.sellerDesc}>
                    <Text style={userStyles.usersName}>{name}</Text>
                    <Text>{`Joind: ${moment(new Date(createdAt)).format("MMM Do YYYY")}`}</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={25}/>
        </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    section:{
        width: '95%',
        marginTop: 15
    },
    titleAndHeart:{
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailText:{
        fontSize:18,
    },
    title:{
        fontSize: 20,
        fontWeight: '600',
        width: '90%'
    },
    heart:{
        position: 'absolute',
        right: 0,
    },
    detail:{
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexWrap:'wrap',
        marginTop: 25
    },
})

const descStyle = StyleSheet.create({
    descriptionView:{
        width: '95%',
    },
    descriptionTitle:{
        fontSize: 18,
        fontWeight: '600'
    },
    description:{
        fontSize: 17,
        marginTop: 6
    },
})

const userStyles = StyleSheet.create({
    sellerContainer:{
        width:'100%'
    },
    title:{
        fontSize: 18,
        fontWeight: '600',
        marginLeft: '2.5%',
    },
    seller:{
        flexDirection:'row',
        width:'95%',
        height: 80,
        alignItems:'center',
        position:'relative',
        marginLeft: '2.5%'
    },
    sellerImage:{
        height: 70,
        width: 70,
        backgroundColor: 'lightgrey',
        borderRadius:100,
        marginRight: 10
    },
    sellerDesc:{
        marginLeft: 10,
        flex:1,
        height: '70%',
        justifyContent:'space-evenly',
        width: '95%'
    },
    usersName:{
        fontSize: 18,
        fontWeight: '500'
    },
})
