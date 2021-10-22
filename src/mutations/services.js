import { gql } from "@apollo/client";

export const LIKE_SERVICE = gql`
  mutation likeService($serviceId: ID!) {
    likeService(serviceId: $serviceId) {
      message
      service{
      id
      title
      description
      price
      createdAt
      }
    }
  }
`;

export const REMOVE_SERVICE_LIKE = gql`
  mutation removeServiceLike($serviceId: ID!) {
    removeServiceLike(serviceId: $serviceId) {
      message
    }
  }
`;

export const CREATE_SERVICE = gql`
  mutation createService(
    $description: String,
    $title: String,
    $price: Int,
    $placesCanMeet: String
    ){
      createService(
        description: $description,
        title: $title,
        price: $price,
        placesCanMeet: $placesCanMeet
      ){
        id
        title
        description
        createdAt
      }
    }
`
