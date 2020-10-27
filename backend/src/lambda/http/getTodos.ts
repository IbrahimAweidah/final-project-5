import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getAllTodos } from "../../Logic/todos";
import { getUserId } from '../utils'
import { APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event);
  console.log('Processing event: ', event)
 
  const todos = await getAllTodos(userId);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items: todos
    })
};
})

handler.use(
  cors({
    credentials: true
  })
)