import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import { createTodo } from '../../businessLogic/todos';
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

const theNewTODO: CreateTodoRequest = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
console.log(theNewTODO.name)
  if (!theNewTODO.name) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'ERROR: The name is empty.'
      })
    };
  }


  const todo = await createTodo(event, theNewTODO);

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },

    body: JSON.stringify({
      item: todo
    })
  };
}
