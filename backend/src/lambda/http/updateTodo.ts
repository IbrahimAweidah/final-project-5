import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLE
const itemId = uuid.v4()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  const updatedItem = {
    id: itemId,
    ...updatedTodo
  }

  var params = {
    TableName: todoTable,
    Key: { todoId },
    UpdateExpression: 'set name = :newname',
    ExpressionAttributeValues: { ':newname': updatedItem.name }, //TODO: add done and dueDate
  }
  try {
    await docClient.update(params).promise()
  } catch (err) {
    return err
  }


  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: "Updated"
  }
}
