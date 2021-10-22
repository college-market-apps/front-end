import axios from 'axios'
import {getToken} from './LocalStorage'
import {auth} from '../../firebase'
const getHeaders = ()=>{
  // const token = await getToken()
  return {
    headers:{
    authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjI3MTgxNTM4fQ.iTOhmt8swqmpWa_uV2_TUuQSQyFARH0Cg42p5dNsvVQ',//token
    fbToken: auth?.currentUser?.getIdToken(true)
  }
  }
}
export const copyObject = (obj)=>{
    return JSON.parse(JSON.stringify(obj))
}

const defaultHeaders = getHeaders()

const API = async ({method="get",url, body={}, contentUpload=false}, headersData)=>{
  const baseUrl = 'http://192.168.254.26:3000'
  // const baseUrl = 'https://api-college-mart.herokuapp.com'
  let fbtoken = await auth?.currentUser?.getIdToken(true)
  if (!fbtoken) fbtoken = ''
  let headers = {
    headers:{
    'Accept': 'application/json',
    authorization:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjMwMTIwOTIzfQ.wQHgrpBTL2aypGPw7xMBI7Z58LH8oG9ZETXt4isN16g', // local
    fbtoken
    }
  }
  if (contentUpload) headers.headers['Content-Type'] ='multipart/form-data'
  if (headersData) headers = { ...headers, ...headersData }

  let res;
  if (method === 'get'){
    res = await axios.get(baseUrl+url, headers )
  }
  if (method === 'put'){
    res = await axios.put(baseUrl+url, body,headers )
  }
  if (method === 'post'){
    res = await axios.post(baseUrl+url, body, headers)
  }
  return res
}

const defaultConfig = {
    method: 'get',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    body: null,
};

export default API
