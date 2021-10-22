import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform,Text ,StyleSheet,Pressable,CameraRoll } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {uploadFile, getFileStream, getUrl,getImage,uploadFileBackground} from '../helpers/S3'
import {POST_TO_AWS} from '../mutations/images'
import {GET_SIGNED_URL} from '../queries/user'
import {SINGLE_UPLOAD} from '../mutations/images'
import { useLazyQuery,useMutation } from '@apollo/client';
import { ReactNativeFile } from 'apollo-upload-client';
import axios from 'axios'
import * as mime from 'react-native-mime-types';

export default function ImagePickerExample({setImageFile=()=>{}, buttonStyle={}, containerStyle={}}) {
  const [image, setImage] = useState(null);
  const [postToAWSMutation] = useMutation(POST_TO_AWS)
  const [postSingleImageMutation] = useMutation(SINGLE_UPLOAD)
  const [getSignedUrl, {loading, data}] = useLazyQuery(GET_SIGNED_URL)
  const [localImages, setLocalImages] = useState([])
  if (loading){
    return <Text>Loading</Text>
  }

  async function postImage(image){
    const data = getImageFormData({uri: image.uri, type: image.type || 'image'})
    const headers =  {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
    }
    const {data: imageData} = await axios.post('http://172.16.108.68:3000/api/images', data, headers)
    setImage(imageData.uri)
  }

  function getImageFormData({type, uri}){
    const data = new FormData();
    // data.append('name', 'avatar');
    data.append('fileData', {
      uri : uri,
      type: type,
      name: `${new Date()}`
    });
    return data
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 5,
    });

    if (!result.cancelled) {
      try {
        // post image request
        setLocalImages([result, ...localImages])
      } catch (error) {
        console.log('error aws---->', error)
      }
    }
  };

  return (
    <View>
    <View style={[{ alignItems: 'center', justifyContent: 'center' , height: 30,width: 100, backgroundColor:'lightblue', borderRadius: 5},buttonStyle]}>
      <Pressable onPress={pickImage} >
        <Text style={[containerStyle]}>Add Image</Text>
      </Pressable>
    </View>
    <View style={styles.localImages}>
      {
        localImages.map((image, index)=>{
          let needMarginRight = localImages.length % 2 === 1 && localImages.length -1 === index ? 'auto' :""
          const marginRight = needMarginRight ? {marginRight: 'auto'} : {}
          return (
            <Image key={image.uri} source={{ uri: image.uri }} style={[styles.localImage, marginRight]} />
          )
        })
      }
    </View>
    {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    </View>
  );
}

const styles= StyleSheet.create({
  localImages:{
    width: '90%',
    marginRight:'auto',
    marginLeft:'auto',
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent: 'space-evenly',
  },
  localImage:{
    width: 150,
    height: 150,
    margin: 10,
    borderRadius: 5
  }
})
