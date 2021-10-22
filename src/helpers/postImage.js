import API from './api'
import axios from 'axios'
function getImageFormData({type, uri}){
    const data = new FormData();
    data.append('fileData', {
      uri : uri,
      type: type,
      name: `${new Date()}`
    });
    return data
}

function appendAnImage({ formData, type, uri }){
  formData.append('fileData', {
    uri : uri,
    type: type,
    name: `${new Date()}`
  });
  return formData
}

export function getImagesFormData(images){
  const ImageFiles = new FormData()
  for (let i in images){
    const { uri, type } = images[i]
    ImageFiles.append('fileData', { uri : uri, type: type, name: `${new Date()}` });
  }
  return ImageFiles
}

export const postImage = async (image)=>{
    const files = new FormData()
    const data = getImageFormData({uri: image.uri, type: image.type || 'image'})
    const headers =  {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
    }
    // const {data: imageData} = await axios.post('http://172.16.108.68:3000/api/images', data, headers)
    const { data: imageData } = await API({ method:'post', url:'/api/images',body: data,contentUpload: true })
    return imageData
}

export const postImages = async (images)=>{
  let imagePaths = []
  // post image to aws
  for (let i=0; i < images.length;i++){
    let image = images[i]
    const res = await postImage(image)
    imagePaths.push(res.imagePath)
  }
  return imagePaths
  // post image to db
  // for (let i=0; i< imagePaths.length; i++){
  //   let path = imagePaths[i]
  //   const body = {...idObj, path}
  //   const {data} = await axios.post('http://172.16.108.68:3000/api/images/paths',body)

  // }

}
