import 'source-map-support/register';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda';
import { getJobs } from '../../businessLogic/jobs';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
console.log('getJobs lambda')
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items: await getJobs(event)
    })
  };
}