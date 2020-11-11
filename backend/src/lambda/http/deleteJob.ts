import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { deleteJob } from '../../businessLogic/jobs';


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  if (!(await deleteJob(event))) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Sorry. This job does not exist'
      })
    };
  }

  console.log("job exists and will be removed")

  return {
    statusCode: 202,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
  };
}