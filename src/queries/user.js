import { gql } from "@apollo/client";

export const GET_USER_BY_UID = gql`
    query getUserByUid($uid: String){
        getUserByUid(uid: $uid){
            uid
        }
    }
`

export const LOGIN_BY_TOKEN = gql`
  mutation loginByToken($token:String){
    loginByToken(token: $token){
      name
      email
      id

    }
  }
`

export const GET_USER = gql`
  mutation Login($username: String!, $password: String!) {
    logIn(username: $username, password: $password) {
      token
    }
  }
`;

export const GET_USER_INFO = gql`
  query getUser{
    getUser{
      id
    }
    }
`;

export const GET_SIGNED_URL = gql`
  query getSignedUrl($key: String){
    getSignedUrl(key: $key){
      url
    }
  }
`
export const GET_PRODUCTS_LIKED = gql`
  query productLikes{
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
            profileImage
          }
        }
    }
  }
`

export const GET_SERVICES_LIKED = gql`
  query serviceLikes{
   getUserServiceLikes{
      services{
        id
        title
        description
        price
        createdAt
        images{
            path
            id
          }
        tags{
          title
          id
        }
        user{
          name
          id
          createdAt
          firebaseID
          profileImage
        }
        ratings{
          description
          title
          id
          createdAt
        }
      }
    }
  }
`

export const SINGLE_PAGE_PRODUCT_LIKEED = gql`
  query productLikes{
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
            profileImage
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
`

export const GET_INIT_LOAD = gql`
  query userData{
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
          profileImage
        }
      }
    }

    getUserServiceLikes{
      services{
        id
        price
        title
        description
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
          uid
        }
      }
    }
}
`;
