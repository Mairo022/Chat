import { messageDeleteRequest } from "../services/chatServices";
import '../styles/components/DeleteMessageDialog.sass';
import { IDeleteMessageDialog } from "../types/chatTypes";
import { useEffect, useState } from "react";

function DeleteMessageDialog(props: IDeleteMessageDialog): JSX.Element {
    const setVisible = props.setVisible
    const messageID = props.messageID
    const roomID = props.roomID
    const socket = props.socket

    const [error, setError] = useState<string>()

    function handleDelete(): void {
        if (!messageID) return

        messageDeleteRequest(messageID)
            .then(() => {
                socket.emit("message deleted", roomID)
                setVisible(false)
            })
            .catch(() => {
                setError("Failed to delete")
            })
    }

    function handleOutsideClick(e: MouseEvent): void {
        const el = e.target as Element

        if (!el.className.includes("Dialog")) {
            setVisible(false)
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick, true)

        return () => {
            document.removeEventListener('click', handleOutsideClick)
        }
    }, [])

    return (
        <div className="Dialog">
            <div className="Dialog__background"> </div>
            <p className="Dialog__text">This message will be deleted</p>
            <p className="Dialog__error">{ error }</p>
            <button className="Dialog__cancel Dialog__button" onClick={ () => setVisible(false) }>Cancel</button>
            <button className="Dialog__delete Dialog__button" onClick={ () => { handleDelete() } }>Delete</button>
        </div>
    )
}

export default DeleteMessageDialog