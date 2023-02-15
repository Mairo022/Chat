interface IRoomModel {
    room: string,
    users: Array<string>
}

interface ICreateRoom {
    userID: string
    targetUserID: string
}

export type {
    ICreateRoom,
    IRoomModel
}