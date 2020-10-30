import * as AWS from 'aws-sdk';
// import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';


const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS);

export default class TodosAccess {
  constructor(
      private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
      private readonly todosTable = process.env.TODOS_TABLE,
      private readonly indexName = process.env.INDEX_NAME,
      private readonly todosStorage = process.env.S3_BUCKET
  ) {}

  async addTodoToDB(todoItem) {
      await this.docClient.put({
          TableName: this.todosTable,
          Item: todoItem
      }).promise();
  }

  async deleteTodoFromDB(todoId, userId) {
      await this.docClient.delete({
          TableName: this.todosTable,
          Key: {
              todoId,
              userId
          }
      }).promise();
  }

  async getTodoFromDB(todoId, userId) {
      const result = await this.docClient.get({
          TableName: this.todosTable,
          Key: {
              todoId,
              userId
          }
      }).promise();

      return result.Item;
  }

  async getAllTodosFromDB(userId) {
      const result = await this.docClient.query({
          TableName: this.todosTable,
          IndexName: this.indexName,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
              ':userId': userId
          }
      }).promise();

      return result.Items;
  }

  async updateTodoInDB(todoId, userId, updatedTodo) {
    console.log("updateTodo2:" +todoId+ " " +userId)
    
      await this.docClient.update({
          TableName: this.todosTable,
          Key: {
              todoId,
              userId
          },
          UpdateExpression: 'set #name = :n, #dueDate = :due, #done = :d',
          ExpressionAttributeValues: {
              ':n': updatedTodo.name,
              ':due': updatedTodo.dueDate,
              ':d': updatedTodo.done
          },
          ExpressionAttributeNames: {
              '#name': 'name',
              '#dueDate': 'dueDate',
              '#done': 'done'
          }
      }).promise();
  }

  async updateTodoAttachmentUrl(todoId: string, attachmentUrl: string){

    await this.docClient.update({
        TableName: this.todosTable,
        Key: {
            "todoId": todoId
        },
        UpdateExpression: "set attachmentUrl = :attachmentUrl",
        ExpressionAttributeValues: {
            ":attachmentUrl": `https://${this.todosStorage}.s3.amazonaws.com/${attachmentUrl}`
        }
    }).promise();
}
}