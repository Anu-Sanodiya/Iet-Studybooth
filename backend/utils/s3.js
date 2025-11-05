const AWS = require('aws-sdk');
const s3 = new AWS.S3();


async function uploadToS3({ bucket, key, body, contentType }){
const params = { Bucket: bucket, Key: key, Body: body, ContentType: contentType };
const res = await s3.upload(params).promise();
return res.Location; // public URL
}


module.exports = { uploadToS3 };