import express from 'express'
import { catchErrors } from "../utils/errorHandler";
import chatController from "./chatController";
import { jwtAuth } from "../../middleware/authMiddleware";

const router = express.Router()

router.post("/messages", jwtAuth, catchErrors(chatController.sendMessage))
router.get("/messages/:roomID", jwtAuth, catchErrors(chatController.getMessages))
router.get("/search-user", jwtAuth, catchErrors(chatController.searchUser))

export {
    router as chatRoute
}