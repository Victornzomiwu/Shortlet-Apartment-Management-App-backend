import { Request, Response } from "express";
import { NotificationsModel } from "../notifications/model";
import UserRequest from "../../types/userRequest";

// Get all unseen notifications for a user
export const getAllUnseenNotifications = async (req: UserRequest, res: Response) => {
	try {
		const userId = req.user?.id;

		if (!userId) {
			return res.status(400).json({ message: "User ID not found" });
		}

		const unseenNotification = await NotificationsModel.findAll({
			where: {
				notificationStatus: "unseen",
				userId: userId,
			},
		});

		return res.status(200).json({
			message: "Notifications Retrieved Successfully",
			unseenNotification,
		});
	} catch (error) {
		console.error("Error retrieving unseen notifications:", error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

// Update a Notification Status
export const UpdateNotificationStatus = async (req: Request, res: Response) => {
	// get notification id to update
	const id = req.params.id;
	try {
		// find the data to update from database and update
		const notification = await NotificationsModel.findOne({ where: { id } });

		if (!notification) {
			return res.status(400).json({
				message: "Notification does not exist",
			});
		}

		const updated = await notification.update({ notificationStatus: "seen" });

		return res.status(201).json({
			message: "Updated Successfully",
			updated,
		});
	} catch (error) {
		console.error("Error updating Notificaiton:", error);
		return res.status(500).json({
			error: "Internal Server Error",
		});
	}
};
