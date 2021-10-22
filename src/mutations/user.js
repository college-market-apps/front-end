import { gql } from "@apollo/client";

export const SING_UP = gql`
    mutation signUp( $uid: String, $email: String){
        signUp(uid: $uid, email: $email){
            id
            email
            uid
            token
        }
    }
`

export const GET_USER_BY_UID = gql`
    mutation user($uid: String){
        loginByUid(uid: $uid){
            email
            token
            name
            id
        }
    }
`
