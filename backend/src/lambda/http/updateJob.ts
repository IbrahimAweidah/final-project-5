import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { updateJob } from '../../businessLogic/jobs';
import { UpdateJobRequest } from '../../requests/UpdateJobRequest';


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {


  const theUpdatedJOB: UpdateJobRequest = JSON.parse(event.body);

  const isChanged = await updateJob(event, theUpdatedJOB);
  console.log("Check changed" + isChanged)

  if (!isChanged) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Sorry, but this job does not exist'
      })
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
  }
}
