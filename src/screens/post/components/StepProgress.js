import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native'

export const StepOneProgress = ()=>{
    return (
        <View style={styles.steps}>
            <View style={styles.circle}>
                <Text>1</Text>
            </View>
            <View style={styles.lightLine}></View>
            <View style={styles.lightCircle}>
                <Text>2</Text>
            </View>
            <View style={styles.lightLine}></View>
            <View style={styles.lightCircle}>
                <Text>3</Text>
            </View>
        </View>
    )
}

export const StepTwoProgress = ()=>{
    return (
        <View style={styles.steps}>
            <View style={styles.circle}>
                <Text>1</Text>
            </View>
            <View style={styles.line}></View>
            <View style={styles.circle}>
                <Text>2</Text>
            </View>
            <View style={styles.lightLine}></View>
            <View style={styles.lightCircle}>
                <Text>3</Text>
            </View>
        </View>
    )
}

export const StepThreeProgress = ()=>{
    return (
        <View style={styles.steps}>
            <View style={styles.circle}>
                <Text>1</Text>
            </View>
            <View style={styles.line}></View>
            <View style={styles.circle}>
                <Text>2</Text>
            </View>
            <View style={styles.line}></View>
            <View style={styles.circle}>
                <Text>3</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    steps:{
        height: 30,
        // position: 'absolute',
        top: 10,
        flexDirection:'row',
        alignItems: 'center',
        marginBottom: 50
    },
    circle:{
        height: 30,
        width: 30,
        borderWidth: 2,
        backgroundColor:'transparent',
        borderColor:'green',
        borderRadius:100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lightCircle:{
        height: 30,
        width: 30,
        borderWidth: 2,
        backgroundColor:'transparent',
        borderColor:'#E9EBEF',
        borderRadius:100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    line:{
        height: 1,
        width: 50,
        backgroundColor:'green'
    },
    lightLine:{
        height: 1,
        width: 50,
        backgroundColor:'#E9EBEF'
    }
})
