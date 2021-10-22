import S3 from 'aws-sdk/clients/s3'
import {process} from '../../env'
import { Platform } from 'react-native';
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import RNBackgroundUploader from 'react-native-background-upload';

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});


export const presignedGETURL = (key)=>{
    let data = s3.getSignedUrl('getObject', {
      Bucket: bucketName,
      Key: key, //filename
      // Expires: 120 //time to expire in seconds
  });
  return data
}

export function getAWSSignedUrl(Key) {
    if (!Key) return Key
    return s3.getSignedUrl('getObject', { Bucket: bucketName, Key });
}

export function getSignedUrlPutObject(Key) {
        return s3.getSignedUrl('putObject', { Bucket: bucketName, Key, ContentType:"image/jpeg", ACL : 'public-read'});
    }

export const uploadFileBackground = async (filePath)=>{
  // Infer the type of the image
  // let match = /\.(\w+)$/.exec(filePath);
  let Key = filePath.replace('.jng', '').replace('file://', '')
  const metadata = await RNBackgroundUploader.getFileInfo(Key);
  const s3Url = await getAWSSignedUrl(Key)
  RNBackgroundUploader.startUpload({
    url: s3Url,
    path: Platform.select({ ios: filePath, android: filePath }),
    method: 'PUT',
    headers: {
        'Content-Type': "image/jpeg",
        key: Key,
    },
    notification: { enabled: false }
})
}
// uploads a file to s3
export function uploadFile(uri) {
  // const fileStream = fs.createReadStream(file.path);
  // ImagePicker saves the taken photo to disk and returns a local URI to it
  let localUri = uri;
  let filename = localUri.split('/').pop();

  // Infer the type of the image
  let match = /\.(\w+)$/.exec(filename);
  let type = match ? `image/${match[1]}` : `image`;

  // Upload the image using the fetch and FormData APIs
  // let formData = new FormData();
  // Assume "photo" is the name of the form field the server expects
  // formData.append('photo', { uri: localUri, name: filename, type });
  // const {data} = getSignedUrlPutObject(filename)
  const uploadParams = {
    // url: url,
    Bucket: bucketName,
    Body: uri,
    Key: filename.replace('.jpg',''),
  };

  return s3.upload(uploadParams).promise();
};

// download a file from s3
export function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };
  if (!fileKey) {
    return "";
  }
  return s3.getObject(downloadParams).createReadStream();
}

export async function getImage(key){
  const data =  s3.getObject(
    {
      Bucket: bucketName,
      Key: key
    }
  ).promise();
  return data;
}

// delete file
export function deleteImage(imagePath) {
  const deleteParams = {
    Bucket: bucketName,
    Key: imagePath,
  };

  return s3.deleteObject(deleteParams).promise();
}


// const SingS3 = new S3({
//   credentials: access,
//   region: process.env.S3_REGION, //"us-west-2"
//   signatureVersion: "v4",
// });

export const getUrl = async (key)=>{
  // const fileId = uuid();
  const signedUrlExpireSeconds = 60 * 180; // expires in 3 hrs
  const url = await s3.getSignedUrlPromise("putObject", {
    Bucket: bucketName,
    Key: key,//`${fileId}.jpg`,
    ContentType: "image/jpeg",
    Expires: signedUrlExpireSeconds,
  });
  return {
    url,
    key,
  }
}

// const uploadImageOnS3 = async (file) => {
//    const s3bucket = new S3({
//      accessKeyId: '<ACCESS_KEY_ID>',
//      secretAccessKey: '<SECRET_ACCESS_KEY>',
//      Bucket: '<BUCKET_NAME>',
//      signatureVersion: 'v4',
//    });
// }

// let contentType = 'image/jpeg';
// let contentDeposition = 'inline;filename="' + file.name + '"';
// const base64 = await fs.readFile(file.uri, 'base64');
// const arrayBuffer = decode(base64);
// s3bucket.createBucket(() => {
//      const params = {
//        Bucket: '<BUCKET_NAME>',
//        Key: file.name,
//        Body: arrayBuffer,
//        ContentDisposition: contentDeposition,
//        ContentType: contentType,
//    })


