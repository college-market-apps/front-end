import React, { useState, useEffect } from 'react'
import { View, ScrollView, FlatList, Image, Text, StyleSheet, Dimensions, Animated, Modal, Pressable } from 'react-native'
const { width } = Dimensions.get('window')
import ImageViewer from 'react-native-image-zoom-viewer'
const defaultImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMvZ5Y-5HFVqtifQWSZz37wid8f6RilVXY1rmH95eqdkNEvP7COyJZudOmyivALP7_oxA&usqp=CAU'
import { presignedGETURL } from '../../helpers/S3'
function Dots(){
    return null
}

function RenderFullScreen({images, visible, onClose}){
    const urls = images.reduce((a,c)=>{
        a.push({ url: c.path})
        return a
    },[])

    return (
        <Modal visible={visible} transparent={true}>
            <ImageViewer imageUrls={urls} onClose={onClose} enableImageZoom={true} enableSwipeDown={true} onClick={onClose} onSwipeDown={onClose}/>
        </Modal>
    )
}


export default function SnapCarosel({ images=[], sold }){
    if (!images || !images.length) return null
    const [imageData, setImageData] = useState(images)
    const [fullScreen, setFullScreen] = useState(false)
    useEffect(()=>{
        const singedUrls = images.map((x)=>{
            if (x.isAWS) x.path = presignedGETURL(x.path)
            return x
        })
        setImageData(singedUrls)
    },[])
    function renderImage({ item }){
        if (!item.path) return null
        return (
            <Pressable onPress={()=>setFullScreen(true)}>
                <Image source={{uri: item.path || defaultImage}} style={styles.image}/>
            </Pressable>
        )
    }

    if (fullScreen) return (
        <RenderFullScreen
            visible={fullScreen}
            images={images}
            onClose={()=>setFullScreen(false)}
        />
    )

    return (
        <View>
            <FlatList
                data={imageData}
                renderItem={renderImage}
                horizontal={true}
                snapToAlignment="start"
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                scrollEnabled
                scrollEventThrottle={16}
                decelerationRate={"fast"}
                keyExtractor={item => String(item.id)}
            />
            {sold && <Text style={styles.sold}>Sold</Text>}
            <Dots />
        </View>
    )
}

const styles = StyleSheet.create({
    image:{
        width: width,
        height: 350,
        position:'relative',
        backgroundColor:'lightgrey'
    },
    sold:{
        position: 'absolute',
        right: 10,
        top: 20,
        fontSize: 20,
        color: 'white',
        backgroundColor:'red',
        padding: 10,
        width: 100,
        textAlign:'center'
    }
})
