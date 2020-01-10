import * as uuid from 'uuid'
import { TodoAccess } from '../dataLayer/todoAccess'
import { TodoStorage } from '../dataLayer/todoStorage'
import { getUserId } from '../lambda/utils'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoItem } from '../models/TodoItem'
const todoAccess = new TodoAccess()
const todoStorage = new TodoStorage()


export async function getTodos(event) {
    const userId = getUserId(event)
    return await todoAccess.getTodosPerUser(userId)
}

export async function createTodo(event) {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    const itemId = uuid.v4()

    const newItem: TodoItem = {
        todoId: itemId,
        userId: userId,
        done: false,
        ...newTodo
    }
    await todoAccess.createTodo(newItem)
    return newItem
}
export async function updateTodo(event) {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    return await todoAccess.updateTodo(todoId, userId, updatedTodo)
}
export async function deleteTodo(event) {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    return await todoAccess.deleteTodo(todoId, userId)
}
export async function upload(event) {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    const signedUrl = await todoStorage.getUploadURL(todoId)
    await todoAccess.updateURL(todoId, userId)
    return signedUrl
}