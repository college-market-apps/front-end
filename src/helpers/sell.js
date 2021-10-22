
export const postProduct = async (variables, mutation)=>{
    const res = await mutation({
        variables,
        update:(cache,{data})=>{
            console.log('POSTED DATA----->',data)
        }
    })
    return res
}

export const postService = async (variables, mutation)=>{
    const res = await mutation({
        variables,
        update:(cache,{data})=>{

        }
    })
    return res
}
