import express from "express";
import authenticateMiddleware from "../../library/middlewares/auth";
import { UpdateNotificationStatus, getAllUnseenNotifications } from "./statusController";

const router = express.Router();

router.patch("/notifications/seen/:id", authenticateMiddleware, UpdateNotificationStatus);
router.get("/unseen-notifications", authenticateMiddleware, getAllUnseenNotifications);

export default router;
