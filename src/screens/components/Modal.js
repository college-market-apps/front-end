import React from 'react'
import {Modal as RNModal, View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback,Pressable} from 'react-native'
// import { BlurView } from "@react-native-community/blur"
export default function Modal({children,modalStyle,visible, addBlur=false,innerViewStyle,onClose,onCloseBottom}){
    return (
        <RNModal
            animationType="slide"
            transparent={true}
            visible={visible}
        >
            {/* <BlurView
                style={styles.blurOverlay}
                blurType='dark'
                blurAmount={10}
                reducedTransparencyFallbackColor="#FFF"
            /> */}
            <View style={[styles.defaultModleStyle,modalStyle]} onPress={()=>{}}>
                {onClose && <Pressable style={{flex: 1}} onPress={onClose}/>}
                <View style={[innerViewStyle]}>
                    {children}
                </View>
                {onCloseBottom && <Pressable style={{flex: 1}} onPress={onClose}/>}
            </View>
        </RNModal>
    )
}

const styles = StyleSheet.create({
    defaultModleStyle:{
        height: 200,
        width: '80%',
    }
})
