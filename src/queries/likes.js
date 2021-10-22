import { gql } from "@apollo/client";

export const GET_USER_PRODUCT_LIKES = gql`
  query getUserProductLikes {
    getUserProductLikes{
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
        }
      }
    }
  }
`;
