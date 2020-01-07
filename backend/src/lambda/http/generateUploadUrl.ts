import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
const AWS = require('aws-sdk')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  const s3 = new AWS.S3( {
      signatureVersion: 'v4'
  })
  const signedUrl = s3.getSignedUrl('putObject', {
    Bucket: 'ms10596-todo',
    Key: todoId,
    Expires: 300

  })

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
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
