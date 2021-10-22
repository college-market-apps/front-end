import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Modal from '../../components/Modal'

export default function SwipeScreen({visible, onClose}){
    return (
        <Modal visible={true} innerViewStyle={styles.innerViewStyle} modalStyle={styles.modalStyle}>
            <View style={styles.container}>
                <Text style={styles.header}>To View Items you have sold or purchased, swipe right on the body of the screen</Text>
                <TouchableOpacity style={styles.done} onPress={onClose}>
                    <Text>Done</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalStyle:{
        height: "100%",
        width:'100%',
        justifyContent:'center',
        alignItems: 'center',
    },
    innerViewStyle:{
        minHeight: 150,
        width: '100%',
        backgroundColor:'white',
        marginTop: 'auto',
        padding: 10,
        paddingTop: 20,
    },
    container:{
        flex: 1
    },
    header:{
        textAlign:'center',
        fontSize: 16,
        fontWeight: '600'
    },
    done:{
        height: 40,
        width: '50%',
        backgroundColor:'lightgrey',
        marginRight:'auto',
        marginLeft:'auto',
        marginTop:'auto',
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    }
})
