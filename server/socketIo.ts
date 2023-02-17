import ChatMessageModel from "./features/chat/chatMessageModel";

function socketIo(io) {
    const connectedUsers: Map<string, string> = new Map()

    io.on("connection", socket => {
        const username: string = socket.handshake.query.username
        const userSocketID: string = socket.id

        connectedUsers.set(username, userSocketID)

        socket.on('joinRoom', (roomID: string) => {
            socket.join(roomID)
        })

        socket.on("private message", async ({ message, sender, receiver, senderID, roomID, isInitial }) => {
            const id = await messageID(senderID)

            if (isInitial === true) {
                const receiverSocketID = connectedUsers.get(receiver)
                const senderSocketID = connectedUsers.get(sender)

                if (receiverSocketID !== undefined) {
                    io.to(receiverSocketID).emit("new room")
                }

                if (senderSocketID !== undefined) {
                    io.to(senderSocketID).emit("new room")
                }
            }

            io.to(roomID).emit("private message", {
                _id: id,
                message,
                sender: {
                    _id: senderID,
                    username: sender
                },
                createdAt: new Date(),
                roomID,
            })
        })

        socket.on("message deleted", roomID => {
            io.to(roomID).emit("message deleted")
        })

        socket.on("disconnect", () => {
            connectedUsers.delete(username)
            clientsCountLogger(io.engine.clientsCount)
        })

        clientsCountLogger(io.engine.clientsCount)
    })

    io.engine.on("connection_error", e => {
        console.log(e.message)
    })
}

const clientsCountLogger = (clients: number) => {
    console.log(`Connection established with ${ clients } clients`)
}

const messageID = async (senderID: string): Promise<string> => {
    const message = await ChatMessageModel
        .findOne({ sender: senderID })
        .sort({ createdAt: 'descending' })
        .select("_id")

    return String(message?._id)
}

export default socketIo