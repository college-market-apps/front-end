import { gql } from "@apollo/client";

export const LIKE_PRODUCT = gql`
  mutation likeProduct($productId: ID!) {
    likeProduct(productId: $productId) {
      message
      product{
        id
        price
        title
        description
        placesCanMeet
        sold
        condition
        createdAt
      }
    }
  }
`;

export const REMOVE_PRODUCT_LIKE = gql`
  mutation removeProductLike($productId: ID!) {
    removeProductLike(productId: $productId) {
      message
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation createProduct($description: String,$title: String,$placesCanMeet: String,$condition: String,$price: Int, $schoolId: ID){
    createProduct(description: $description, title: $title, placesCanMeet: $placesCanMeet, condition: $condition, price: $price, schoolId: $schoolId){
      description
      title
      placesCanMeet
      id
      message
    }
  }
`
