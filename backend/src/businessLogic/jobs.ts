import 'source-map-support/register';
import * as uuid from 'uuid';
import { APIGatewayProxyEvent } from 'aws-lambda';

// dev imported
import JobsAccess from '../dataLayer/jobsAccess';
import JobsStorage from '../dataLayer/jobsStorage';
import { getUserId } from '../lambda/utils';
import { CreateJobRequest } from '../requests/CreateJobRequest';
import { UpdateJobRequest } from '../requests/UpdateJobRequest';
import { JobItem } from '../models/JobItem';

const jobsAccess = new JobsAccess();
const jobsStorage = new JobsStorage();

export async function createJob(event: APIGatewayProxyEvent, createJobRequest: CreateJobRequest): Promise<JobItem> {
    const jobId = uuid.v4();
    const userId = getUserId(event);
    const createdAt = new Date(Date.now()).toISOString();
    const bucketName = await jobsStorage.getBucketName();

    const jobItem = {
        userId,
        jobId,
        createdAt,
        done: false,
        attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${jobId}`,
        ...createJobRequest
    };
    console.log('createJobs userId:' + userId + "jobId:"+jobId +"bucketname:" +bucketName )
    await jobsAccess.addJobToDB(jobItem);

    return jobItem;
}

export async function deleteJob(event: APIGatewayProxyEvent) {
    const jobId = event.pathParameters.jobId;
    const userId = getUserId(event);

    if (!(await jobsAccess.getJobFromDB(jobId, userId))) {
        return false;
    }
    console.log('generateUploadUrl jobId:' + jobId + "userId:"+userId )
userId
    await jobsAccess.deleteJobFromDB(jobId, userId);

    return true;
}

export async function getJob(event: APIGatewayProxyEvent) {
    const jobId = event.pathParameters.jobId;
    const userId = getUserId(event);
    console.log('getJobs userId:' + userId + "jobId:"+jobId )
    return await jobsAccess.getJobFromDB(jobId, userId);
}

export async function getJobs(event: APIGatewayProxyEvent) {
    const userId = getUserId(event);
    console.log('getJobs userId:' + userId)
    return await jobsAccess.getAllJobsFromDB(userId);
}

export async function updateJob(event: APIGatewayProxyEvent,
                                 updateJobRequest: UpdateJobRequest) {
    const jobId = event.pathParameters.jobId;
    const userId = getUserId(event);

    if (!(await jobsAccess.getJobFromDB(jobId, userId))) {
        return false;
    }
    console.log('updateJob userId:' + userId + "jobId:"+jobId )
    await jobsAccess.updateJobInDB(jobId, userId, updateJobRequest);

    return true;
}

export async function generateUploadUrl(event: APIGatewayProxyEvent): Promise<string> {
    const bucket = await jobsStorage.getBucketName();
    const urlExpiration = process.env.SIGNED_URL_EXPIRATION;
    const jobId = event.pathParameters.jobId;
    const createSignedUrlRequest = {
        Bucket: bucket,
        Key: jobId,
        Expires: parseInt(urlExpiration)
    }
    console.log('generateUploadUrl bucket:' + bucket + "jobId:"+jobId )
    return await jobsStorage.getPresignedUploadURL(createSignedUrlRequest);
}