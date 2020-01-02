import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODO_TABLE
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  await docClient.update({
      TableName: todosTable,
      Key: {
          todoId: todoId,
          userId: "1"
      },
      UpdateExpression: "set #n = :name, dueDate=:dueDate, done=:done",
      ExpressionAttributeValues:{
        ":name":updatedTodo.name,
        ":dueDate":updatedTodo.dueDate,
        ":done":updatedTodo.done
        },
        ExpressionAttributeNames:{
            "#n": "name"
        },
    ReturnValues:"UPDATED_NEW"
  }).promise()



  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      todoId
    })
  }
}
