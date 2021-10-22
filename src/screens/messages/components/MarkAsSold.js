import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native'
import Modal from '../../components/Modal'
import { useSelector } from 'react-redux'

function mapState(state){
    return {
        isSold:(productId)=> state.ShoppingCart.shoppingCarts.find(x=>x.products.find(y=>y.id===productId))
    }
}

export default function MarkAsSold({ uri, title , onClose, onSellProduct, sellingItem={}, }){
    const { sold } = sellingItem

    function RenderSelling(){
        return (
            <View style={styles.layout}>
                <Text style={styles.markAsSoldTitle}>Mark Product as Sold?</Text>
                <Text style={styles.markAsSoldText}>We recommend that you wait until you have recived payment to mark as sold. As this action is perminate.</Text>
                <Image source={{uri}} style={styles.image} />
                <View style={styles.buttons}>
                    <TouchableOpacity style={styles.cancel} onPress={onClose}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sell} onPress={onSellProduct}>
                        <Text>Sell Product</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    function RenderSold(){
        return (
            <View style={styles.layout}>
                <Text style={styles.hasBeenSold}>Congratulations! This product has been sold.</Text>
                <Image source={{uri}} style={styles.image}/>
                <View style={styles.buttons}>
                    <TouchableOpacity style={styles.cancel} onPress={onClose}>
                        <Text>Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <Modal innerViewStyle={styles.innerViewStyle} modalStyle={styles.modalStyle} onClose={onClose}>
            <SafeAreaView style={styles.markAsSold}>
                { sold ? <RenderSold /> : <RenderSelling />}
                {/* <RenderSold /> */}
            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    innerViewStyle:{
        width: '100%',
        backgroundColor:'white'
    },
    modalStyle:{
        width: '100%',
        height: '100%',
    },
    layout:{
        width: '100%',
        marginTop: 10
    },
    image:{
        width: 200,
        height: 200,
        marginTop: 50,
        marginBottom:50,
        marginRight:'auto',
        marginLeft:'auto',
    },
    markAsSold:{
        width: '90%',
        marginLeft:'auto',
        marginRight:'auto',
        marginTop: 10,
        flexGrow:1,
        marginTop:'auto',
    },
    markAsSoldTitle:{
        marginLeft:'auto',
        marginRight: 'auto',
        fontSize: 20,
        fontWeight: '600'
    },
    markAsSoldText:{
        fontSize: 14,
        textAlign:'center',
        marginTop: 5
    },
    hasBeenSold:{
        fontSize: 20,
        fontWeight:'600',
        textAlign:'center',
        marginTop: 5
    },
    buttons:{
        flexDirection:'row',
        justifyContent: 'space-evenly',
        marginTop:'auto',
        // height:'90%',
    },
    cancel:{
        height: 50,
        width: 150,
        backgroundColor:'lightgrey',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:'auto'
    },
    sell:{
        height: 50,
        width: 150,
        backgroundColor:'green',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:'auto'
    }
})
