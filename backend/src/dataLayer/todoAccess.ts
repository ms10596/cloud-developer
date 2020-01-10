import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

export class TodoAccess {

  constructor(
    private readonly docClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todoTable = process.env.TODO_TABLE,
    private readonly index = process.env.INDEX_NAME) {
  }

  async getTodosPerUser(userId: String) {
    console.log('Getting todos')

    const result = await this.docClient.query({
      TableName: this.todoTable,
      IndexName: this.index,
      KeyConditionExpression: "userId = :u",
      ExpressionAttributeValues: {
        ":u": userId
      }
    }).promise()
    return result.Items
  }


  async createTodo(item: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todoTable,
      Item: item
    }).promise()
    return item
  }

  async deleteTodo(todoId: String, userId: String) {
    return await this.docClient.delete({
      TableName: this.todoTable,
      Key: {
        todoId: todoId,
        userId: userId
      }
    }).promise()
  }
  async updateTodo(todoId: String, userId: String, updatedTodo: TodoUpdate) {
    return await this.docClient.update({
      TableName: this.todoTable,
      Key: {
        todoId: todoId,
        userId: userId
      },
      UpdateExpression: "set #n = :name, dueDate=:dueDate, done=:done",
      ExpressionAttributeValues: {
        ":name": updatedTodo.name,
        ":dueDate": updatedTodo.dueDate,
        ":done": updatedTodo.done
      },
      ExpressionAttributeNames: {
        "#n": "name"
      },
      ReturnValues: "UPDATED_NEW"
    }).promise()
  }
  async updateURL(todoId: String, userId: String) {
    return await this.docClient.update({
      TableName: this.todoTable,
      Key: {
        todoId: todoId,
        userId: userId
      },
      UpdateExpression: "set attachmentUrl = :signedUrl",
      ExpressionAttributeValues: {
        ":signedUrl": "https://ms10596-todo.s3.amazonaws.com/" + todoId
      },
      ReturnValues: "UPDATED_NEW"
    }).promise()
  }
}