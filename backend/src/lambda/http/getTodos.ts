import {getUserId} from "../utils"
import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

const docClient = new XAWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODO_TABLE
const Index = process.env.INDEX_NAME


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)
  const userId = getUserId(event)
  const result = await docClient.query({
    TableName: todosTable,
    IndexName: Index,
    KeyConditionExpression: "userId = :u",
  ExpressionAttributeValues: {
       ":u": userId
  }}).promise()

  const items = result.Items

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
}
