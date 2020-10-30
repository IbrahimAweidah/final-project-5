import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { deleteTodo } from '../../businessLogic/todos';


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  if (!(await deleteTodo(event))) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Sorry. This todo does not exist'
      })
    };
  }

  console.log("todo exists and will be removed")

  return {
    statusCode: 202,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
  };
}