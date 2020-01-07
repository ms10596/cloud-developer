import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils'
const uuid = require('uuid')
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODO_TABLE


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    const itemId = uuid.v4()

    const newItem = {
        todoId : itemId,
        userId: userId,
        ...newTodo
    }
    await docClient.put({
        TableName: todosTable,
        Item: newItem
    }).promise()

  // TODO: Implement creating a new TODO item
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      "item": newItem
    })
  }
}
