import express from "express";
import { catchErrors } from "../utils/errorHandler";
import roomController from "./roomController";
import { jwtAuth } from "../../middleware/authMiddleware";

const router = express.Router()

router.post('/', jwtAuth, catchErrors(roomController.createRoom))
router.get('/:userID', jwtAuth, catchErrors(roomController.userRooms))

export {
    router as roomRoute
}