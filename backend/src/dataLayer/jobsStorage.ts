import { CreateSignedURLRequest } from '../requests/CreateSignedURLRequest';
import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
const XAWS = AWSXRay.captureAWS(AWS);
export default class JobsStorage {
    constructor(
        private readonly jobsStorage = process.env.S3_BUCKET,
        private readonly s3 = new XAWS.S3({ signatureVersion: 'v4'})
    ) {}
   async getBucketName() {
        return this.jobsStorage;
    }
   async getPresignedUploadURL(createSignedUrlRequest: CreateSignedURLRequest) {
        return this.s3.getSignedUrl('putObject', createSignedUrlRequest);
    }
}