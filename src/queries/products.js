import { gql } from "@apollo/client";

export const GET_PRODUCTS_BY_SCHOOL = gql`
  query getProductsBySchool($schoolId: ID) {
    getProductsBySchool(schoolId: $schoolId) {
      products{
        id
        price
        title
        description
        placesCanMeet
        sold
        condition
        createdAt
        images{
          path
          id
        }
        tags{
          name
          id
        }
        user{
          name
          id
          createdAt
          firebaseID
          profileImage
        }
      }
    }
  }
`;


export const GET_PRODUCT = gql`
  query getProduct($productId: ID) {
    getProduct(productId: $productId) {
        id
        price
        title
        description
        placesCanMeet
        sold
        condition
        createdAt
        images{
          path
          id
        }
        tags{
          name
          id
        }
        user{
          name
          id
          createdAt
          firebaseID
        }
    }
  }
`;
