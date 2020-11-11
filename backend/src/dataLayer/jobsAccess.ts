import * as AWS from 'aws-sdk';
// import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';


const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS);

export default class JobsAccess {
  constructor(
      private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
      private readonly jobsTable = process.env.JOBS_TABLE,
      private readonly indexName = process.env.INDEX_NAME,
      private readonly jobsStorage = process.env.S3_BUCKET
  ) {}

  async addJobToDB(jobItem) {
      await this.docClient.put({
          TableName: this.jobsTable,
          Item: jobItem
      }).promise();
  }

  async deleteJobFromDB(jobId, userId) {
      await this.docClient.delete({
          TableName: this.jobsTable,
          Key: {
              jobId,
              userId
          }
      }).promise();
  }

  async getJobFromDB(jobId, userId) {
      const result = await this.docClient.get({
          TableName: this.jobsTable,
          Key: {
              jobId,
              userId
          }
      }).promise();

      return result.Item;
  }

  async getAllJobsFromDB(userId) {
      const result = await this.docClient.query({
          TableName: this.jobsTable,
          IndexName: this.indexName,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
              ':userId': userId
          }
      }).promise();

      return result.Items;
  }

  async updateJobInDB(jobId, userId, updatedJob) {
    console.log("updateJob2:" +jobId+ " " +userId)
    
      await this.docClient.update({
          TableName: this.jobsTable,
          Key: {
              jobId,
              userId
          },
          UpdateExpression: 'set #name = :n, #dueDate = :due, #done = :d',
          ExpressionAttributeValues: {
              ':n': updatedJob.name,
              ':due': updatedJob.dueDate,
              ':d': updatedJob.done
          },
          ExpressionAttributeNames: {
              '#name': 'name',
              '#dueDate': 'dueDate',
              '#done': 'done'
          }
      }).promise();
  }

  async updateJobAttachmentUrl(jobId: string, attachmentUrl: string){
    console.log('updateJobAttachmentUrl' + jobId +" "+ attachmentUrl)
    await this.docClient.update({
        TableName: this.jobsTable,
        Key: {
            "jobId": jobId
        },
        UpdateExpression: "set attachmentUrl = :attachmentUrl",
        ExpressionAttributeValues: {
            ":attachmentUrl": `https://${this.jobsStorage}.s3.amazonaws.com/${attachmentUrl}`
        }
    }).promise();
}
}