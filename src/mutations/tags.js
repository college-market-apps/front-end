import { gql } from "@apollo/client";


export const CREATE_PRODUCT_TAGS = gql`
  mutation addProductTags($tags: String, $productId: ID){
    addProductTags(tags: $tags, productId: $productId){
      id
      name
      message
    }
  }
`
