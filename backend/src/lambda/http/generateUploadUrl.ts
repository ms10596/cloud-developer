import 'source-map-support/register'
import { getUserId } from '../utils'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
const docClient = new XAWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODO_TABLE
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

  const s3 = new XAWS.S3( {
      signatureVersion: 'v4'
  })
  const signedUrl = s3.getSignedUrl('putObject', {
    Bucket: 'ms10596-todo',
    Key: todoId,
    Expires: 300

  })

  await docClient.update({
    TableName: todosTable,
    Key: {
        todoId: todoId,
        userId: userId
    },
    UpdateExpression: "set attachmentUrl = :signedUrl",
    ExpressionAttributeValues:{
      ":signedUrl":"https://ms10596-todo.s3.amazonaws.com/"+todoId
      },
  ReturnValues:"UPDATED_NEW"
}).promise()

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      "uploadUrl": signedUrl
    })
  }
}
