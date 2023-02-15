interface IMessage {
    message: string
    sender: string
    roomID: string
}

interface IMessageModel {
    message: string
    sender: string
    room: string
    createdAt: Date
}

export {
    IMessage,
    IMessageModel,
}