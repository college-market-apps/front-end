import axios from 'axios'
// consts
const GET_INIT_LOAD = 'GET_INIT_LOAD'

// actions

// thunks
export const getInitLoad = ()=>{
  return async (dispatch)=>{
    const {data:products} = await axios.get('/api/products/byschool')
    const {data:services} = await axios.get('/api/services/byschool')
    const {data:productLikes} = await axios.get('/api/users/product-likes')
    const {data:serviceLikes} = await axios.get('/api/users/service-likes')
  }
}

// reducer

