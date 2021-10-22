import { gql } from "@apollo/client";

export const GET_SERVICES_BY_SCHOOL = gql`
  query schoolServices{
      getServicesBySchool{
        services{
        id
        title
        description
        price
        createdAt
        user{
          name
          id
          createdAt
          firebaseID
          profileImage
        }
        tags{
          id
          name
          createdAt
        }
        images{
          id
          path
        }
        ratings{
          id
          title
          description
          createdAt
          user{
            name
            profileImage
            id
          }
        }
      }
      }
    }
`
