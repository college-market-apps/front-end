import { gql } from "@apollo/client";

export const POST_TO_AWS = gql`
    mutation postToAWS(
        $fieldname: String,
        $originalname: String,
        $encoding: String,
        $mimetype: String,
        $destination: String,
        $filename: String,
        $path: String,
        $size: Int,
        ) {
    postToAWS(
        fieldname: $fieldname,
        originalname: $originalname,
        encoding: $encoding,
        mimetype: $mimetype,
        destination: $destination,
        filename: $filename,
        path: $path,
        size: $size,
        ) {
        message
        aswImage{
            fieldname
            originalname
            encoding
            description
            filename
            path
            size
            imagePath
            imageUrl
        }
        }
    }
`;

export const SINGLE_UPLOAD = gql`
  mutation($image: Upload!) {
    singleUpload(image: $image) {
      filename
    }
  }
`;
