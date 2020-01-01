
const AWS = require('aws-sdk')

const docClient = new AWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODO_TABLE

exports.handler = async (event) => {
  console.log('Processing event: ', event)

  const result = await docClient.scan({
    TableName: todosTable
  }).promise()

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
