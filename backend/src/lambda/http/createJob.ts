import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { CreateJobRequest } from '../../requests/CreateJobRequest';
import { createJob } from '../../businessLogic/jobs';
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

const theNewJOB: CreateJobRequest = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
console.log(theNewJOB.name)
  if (!theNewJOB.name) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'ERROR: The name is empty.'
      })
    };
  }


  const job = await createJob(event, theNewJOB);

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },

    body: JSON.stringify({
      item: job
    })
  };
}
