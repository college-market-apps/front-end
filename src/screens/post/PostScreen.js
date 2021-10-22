import React, {useState,useEffect} from "react";
import { View,ScrollView, ActivityIndicator, TouchableOpacity, SafeAreaView, Text, StyleSheet, AsyncStorage } from "react-native";
import {shadow} from '../../shared/styles'
import StepOne from './components/StepOne'
import StepTwo from './components/StepTwo'
import StepThree from './components/StepThree'
import { getLocalPost, storeToLocal, addImage_LS, deleteImage_LS, saveSepTwo_LS, addTag_LS, deleteTag_LS } from './LocalStorage1'
import { StepOneProgress, StepTwoProgress,StepThreeProgress} from './components/StepProgress'
import { postNewProduct, postProductWithTagsAndImages } from '../../store/reducers/products'
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
// apis
import { postImages, getImagesFormData } from '../../helpers/postImage'
import LoadingProgress from '../components/Progress'

const initStepTwo  = {
  title: "" ,
  description: '',
  placesCanMeet:'',
  condition: '',
  sellType: '',
}

const progressSteps = {
  PROG_STEP_ONE: <StepOneProgress />,
  PROG_STEP_TWO: <StepTwoProgress />,
  PROG_STEP_THREE: <StepThreeProgress />,
}

const initFormik = {
  images: [],
  tags: [],
  stepTwo: initStepTwo,
}

export default function Sell(props) {
  const [screen, setScreen] = useState("STEP_ONE")
  const [gettingLocalData, setgettingLocalData] = useState(true)
  const [formikData, setFormikData] = useState({})
  const dispatch = useDispatch()
  const [postingItem, setPostingItem] = useState(false)

  async function callLocalStore(){
    let res = await getLocalPost()
    if (!res) res = await storeToLocal(initFormik)
    setFormikData(res)
    setgettingLocalData(false)

  }

  async function onClearFormikData(){
    setFormikData(initFormik)
    await storeToLocal(initFormik)
  }

  function addStateTag(tag){
    const oldTags = formikData.tags || []
    setFormikData({
      ...formikData,
      tags: [tag, ...oldTags]
    })
  }

  function deleteStateTag(tag){
    let newList = formikData.tags || []
    newList = newList.filter(t=> t !== tag)
    setFormikData({
      ...formikData,
      tags: newList
    })
  }

  function addImageToState(image){
    const imageList = formikData.images || []
    setFormikData({
      ...formikData,
      images: [image, ...imageList]
    })
  }

  function deleteStateImage(image){
    const imageList = formikData.images.filter(i=>i.uri !== image.uri)
    setFormikData({
      ...formikData,
      images: imageList
    })
  }

  async function submitFormik(){
    const { stepTwo: product, tags, images } = formikData
    setPostingItem(true)
    try {
      // post all images
      const imagePaths = await postImages(images)
      // create the product with tags and uploaded images
      dispatch(postProductWithTagsAndImages({ product, tags, imagePaths }))
      onClearFormikData()
      setScreen('STEP_ONE')
      setPostingItem(false)
      Toast.show({ text1: 'Your product has been posted!' })
    } catch (error) {
      Toast.show({
        text1:'There was an error posting your product.',
        text2:'Please refresh and try again'
      })
      setPostingItem(false)
    }
  }

  useEffect(() => {
    callLocalStore()
  }, [ ])

  const screenDisplay = {
    STEP_ONE:(
      <StepOne
        initData={formikData.images}
        nextStep={()=>setScreen('STEP_TWO')}
        onAddImage={(image)=>{
          addImageToState(image)
          addImage_LS(image)
        }}
        onDeleteImage={(image)=>{
          deleteStateImage(image)
          deleteImage_LS(image)
        }}
        data={formikData}
      />
    ),
    STEP_TWO:(
      <StepTwo
        data={formikData.stepTwo}
        onGoBack={()=>setScreen('STEP_ONE')}
        nextStep={()=>setScreen('STEP_THREE')}
        onSubmitFormik={(stepTwo)=>{
          setFormikData({...formikData, stepTwo})
          saveSepTwo_LS(stepTwo)
        }}
      />
    ),
    STEP_THREE: (
      <StepThree
        onGoBack={()=>setScreen('STEP_TWO')}
        onPostItem={()=>submitFormik()}
        onAddTag={(tag)=>{
          addTag_LS(tag)
          addStateTag(tag)
        }}
        onDeleteTag={(tag)=>{
          deleteTag_LS(tag)
          deleteStateTag(tag)
        }}
        data={formikData.tags || []}
      />
    )
  }

  if (gettingLocalData) return <Text>Loading (local)....</Text>
  if (postingItem) return <LoadingProgress text="Please wait as this product is posted..." />

  return (
    <View style={{backgroundColor:'white'}}>
    <ScrollView contentContainerStyle={styles.page}>
      {
        progressSteps[`PROG_${screen}`]
      }
      {
        screenDisplay[screen]
      }
    </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    width: "100%",
    minHeight: '100%',
    alignItems: "center",
    marginLeft:'auto',
    marginRight:'auto',
    backgroundColor:'white',
    paddingLeft: '5%',
    paddingRight: '5%',
    // paddingBottom: 100,
    position:'relative'
  },
  options:{
    width: '100%',
    height: 50,
    backgroundColor: 'lightgrey',
    marginTop: 20,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-evenly',
    borderRadius: 10,
    ...shadow
  },
  screenOptions:{
    minWidth: 150,
    paddingLeft: 5,
    paddingRight: 5,
    height: 30,
    backgroundColor: 'lightgreen',
    justifyContent:'center',
    alignItems: 'center',
    borderRadius:10
  },
});
