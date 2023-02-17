import { ISendMessage } from "../types/chatTypes";
import axios, { AxiosInstance, AxiosPromise } from "axios";

const URL: string = process.env.REACT_APP_PROXY as string

const axiosChat: AxiosInstance = axios.create({
    withCredentials: true
})

function messageSendRequest(message: ISendMessage): AxiosPromise {
    return axiosChat.post(`${ URL }/chat/messages`, {
        message: message.message,
        sender: message.sender,
        roomID: message.roomID
    })
}

const messagesGetRequest = (roomID: string, messageID: string = ""): AxiosPromise =>
    axiosChat.get(`${ URL }/chat/messages/${ roomID }?limit=50&id=${ messageID }`)

const messageDeleteRequest = (messageID: string): AxiosPromise =>
    axiosChat.delete(`${ URL }/chat/messages?id=${ messageID }`)

const roomCreateRequest = (userID: string, targetUserID: string): AxiosPromise =>
    axiosChat.post(`${ URL }/chat/rooms`, {
        userID,
        targetUserID
    })

const userRoomsRequest = (userID: string): AxiosPromise =>
    axiosChat.get(`${ URL }/chat/rooms/${ userID }`)

const searchUsersRequest = (username: string): AxiosPromise =>
    axiosChat.get(`${ URL }/chat/search-user?username=${ username }`)

export {
    messageDeleteRequest,
    messageSendRequest,
    messagesGetRequest,
    userRoomsRequest,
    roomCreateRequest,
    searchUsersRequest
}