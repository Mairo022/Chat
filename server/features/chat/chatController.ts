import ChatMessageModel from './chatMessageModel'
import UserModel from "../user/userModel";
import { IMessage } from "./chatTypes";
import { roomExists } from "../room/roomController"
import { throwError } from "../utils/errorHandler";

async function sendMessage(req, res): Promise<void> {
    const { message, sender, roomID }: IMessage = req.body

    if (message === undefined || sender === undefined || roomID === undefined)
        throwError ("Message is in an incorrect form", 400)

    const chatMessage = new ChatMessageModel({
        message: message,
        sender: sender,
        room: roomID
    })

    await chatMessage.save()

    res.status(201).json({ message: "Message sent" })
}

async function getMessages(req, res): Promise<void> {
    const { roomID } = req.params
    const limit = req.query.limit && req.query.limit <= 100 ? req.query.limit : 50
    const fromMessage = req.query.id

    if (!roomID) throwError ("Missing room ID", 400)
    if (!await roomExists(roomID)) throwError ("Unknown room", 404)

    const fromDate = fromMessage && fromMessage !== ""
                     ? await ChatMessageModel
                            .find({ room: roomID })
                            .findOne({ _id: fromMessage })
                            .select("createdAt -_id")
                     : null

    const messages = (
        await ChatMessageModel
            .find({
                room: roomID,
                createdAt: fromDate === null ? { $exists: true } : { $lt: new Date(fromDate.createdAt) },
            })
            .sort({ createdAt: 'descending' })
            .limit(limit)
            .populate('sender', 'username')
    ).reverse()

    res.status(200).json(messages)
}

async function searchUser(req, res): Promise<void> {
    const username = req.query.username

    if (!username) throwError ("Missing username", 400)

    const user = await UserModel
        .find({
            username: { $regex: "^" + username, $options: "i" }
        })
        .select("username _id")

    res.status(200).json(user)
}

async function deleteMessage(req, res) {
    const messageID = req.query.id

    if (!messageID) throwError("Missing message identifier", 400)

    await ChatMessageModel
        .deleteOne({ _id: messageID })
        .catch(() => { throwError("Message does not exist", 404) })

    res.status(204).send()
}

export default {
    deleteMessage,
    sendMessage,
    getMessages,
    searchUser
}