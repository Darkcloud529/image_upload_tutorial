const aws = require("aws-sdk");
const {AWS_SECRET_KEY, AWS_ACCESS_KEY} = process.env;

const s3 = new aws.S3({
    secretAccessKey: AWS_SECRET_KEY,
    accessKeyId: AWS_ACCESS_KEY,
    region: "ap-northeast-2",
});

const getSignedUrl = ({key}) => {
    return new Promise((resolve, reject)=>{
        s3.createPresignedPost({
            Bucket: "image-upload-tutorial-smlee",
            Fields:{
                key
            },
            Expires: 300, // 만료 시간, 초 단위 (기본 1시간)
            Conditions:[
                ["content-length-range", 0, 50 * 1000 * 1000],
                ["starts-with", "$Content-Type", "image/"]
            ]
        }, (err, data)=>{
            if(err) reject(err);
            resolve(data);
        })
    })
}

module.exports = {s3, getSignedUrl};