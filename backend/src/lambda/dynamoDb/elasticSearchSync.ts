import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda'
import 'source-map-support/register'
import * as elasticsearch from 'elasticsearch'
import * as httpAwsEs from 'http-aws-es'

const esHost = process.env.ES_ENDPOINT

const es = new elasticsearch.Client({
    hosts: [esHost],
    connectionClass: httpAwsEs
})

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
    console.log('Processing events batch from DynamoDB', JSON.stringify(event))

    for (const record of event.Records) {
        console.log('Processing record', JSON.stringify(record))
        if (record.eventName !== 'INSERT') {
            continue
        }

        const newItem = record.dynamodb.NewImage

        const jobId = newItem.jobId.S

        const body = {
            userId: newItem.userId.S,
            jobId: newItem.jobId.S,
            name: newItem.name.S,
            dueDate: newItem.dueDate.S,
            done: newItem.done.BOOL,
            createdAt: newItem.createdAt.S
        }

        await es.index({
            index: 'jobs-index',
            type: 'job',
            id: jobId,
            body
        })

    }
}