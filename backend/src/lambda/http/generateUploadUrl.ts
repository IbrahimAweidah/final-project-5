import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
const bucketName = process.env.S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const todoTable = process.env.TODOS_TABLE
const docClient = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  //const todoId = event.pathParameters.todoId
  const itemId = uuid.v4()

  const newItem = await createTodoUrl(itemId, event)

  const url = getUploadUrl(itemId)

  return {
    statusCode: 201,
    
    body: JSON.stringify({
      newItem: newItem,
      uploadUrl: url
    })
  }
}

async function createTodoUrl(todoId: string, event: any) {
  const timestamp = new Date().toISOString()
  const newTodo = JSON.parse(event.body)

  const newItem = {
    timestamp,
    todoId,
    ...newTodo,
    imageUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`
  }
  console.log('Storing new item: ', newItem)

  await docClient
    .put({
      TableName: todoTable,
      Item: newItem
    })
    .promise()

  return newItem
}

function getUploadUrl(todoId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpiration
  })
}