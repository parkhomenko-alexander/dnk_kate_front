import axios from "axios"
import { json } from "stream/consumers"

export const instanseAPI = axios.create({
    baseURL: 'http://localhost:5000'
})

export type Document = {
    files: string[]
    id: number
    name: string
    numbers: string[]
}

type DocumentResponse = {
    documents: Document[]
}

// export const getDocuments = async () => {
//     debugger
//     const response = await instanseAPI.get<DocumentResponse>('/documents')
//     return response
// }

export const getDocuments = async () => {
    return await instanseAPI.get<Document[]>('/documents')
}

export const download = async (id: string) => {
    return await instanseAPI.get('/documents/download/' + id)
}

export const deleteDoc = async (id: string) => {
    return await instanseAPI.delete('/documents/' + id)
}

export const addDocument = async (name: string, numbers: string[], files: File[]) => {
    console.log(numbers)
    return await instanseAPI.post('/documents/add', {
        name: name,
        file: files,
        numbers: numbers,
    }, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}