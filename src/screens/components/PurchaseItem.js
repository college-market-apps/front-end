import React, {useState, useEffect} from 'react'
import { View,TouchableOpacity, Text,StyleSheet,Dimensions,Image } from "react-native";

import {shadow} from '../../shared/styles'
const windowWidth = Dimensions.get('window').width;

const defaultImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMvZ5Y-5HFVqtifQWSZz37wid8f6RilVXY1rmH95eqdkNEvP7COyJZudOmyivALP7_oxA&usqp=CAU'

export default ({item,title,imageUrl, redirectScreen, redirectData,marginRight, navigation})=>{
  const [uri, setUri] = useState(imageUrl || defaultImage)
  marginRight = marginRight ? {marginRight:windowWidth /2 -25 + 20} : {}
  const stack = redirectScreen === 'Single Product' ? 'ProductsStack' : 'ServicesStack'
  function onError(){
    console.log('--ERROR--')
    setUri(defaultImage)
  }

  useEffect(()=>{
    
  },[uri])

  return (
    <TouchableOpacity style={[styles.product, marginRight]}
      onPress={()=>navigation.push(stack,{
        screen:redirectScreen,
          params:{
            ...redirectData,
          }
        })
      }
    >
      <View style={styles.viewImage}>
        <Image
          style={styles.image}
          source={{
            uri: uri
          }}
          onError={onError}
          resizeMode='cover'
        />
      </View>
      <Text
      style={styles.title}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  product:{
    backgroundColor: 'white',
    borderRadius: 10,
    ...shadow,
    width: windowWidth /2 -25,
  },
  viewImage:{
    padding:10
  },
  image:{
    height: windowWidth /2 -50 ,
    width: windowWidth /2 -50,
    marginRight:'auto',
    marginLeft:'auto',
    backgroundColor:'lightgrey',
    borderRadius: 10,
  },
  title:{
    width:'90%',
    marginLeft:10,
    fontWeight:'500',
    fontSize:14,
    paddingBottom:10,
    paddingLeft: 10,
    paddingRight: 10
  }
})
