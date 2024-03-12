import cron from "node-cron";
import moment from "moment";
import { Op } from "sequelize";
import { NotificationsModel } from "./model";
import { UnitsModel } from "../units/model";
import { ReservationsModel } from "../reservations/model";
import { UsersModel } from "../users/model";

// Method to create notifications for reservations starting within the next 24 hours
export const checkinNotifications = async () => {
	try {
		// Calculate the date and time for reservations starting within the next 24 hours
		const checkInDate = moment().add(24, "hours").toDate();

		// Find reservations starting within the next 24 hours
		const upcomingReservations = await ReservationsModel.findAll({
			where: {
				checkInDate: {
					[Op.between]: [moment().toDate(), checkInDate],
				},
			},
		});

		for (const reservation of upcomingReservations) {
			const title = `CheckIn Reminder for ${reservation.customerName}`;
			const body = `Reservation for ${
				reservation.customerName
			} is starting on ${reservation.checkOutDate.toLocaleDateString()}. Please make sure to check them in on time.`;
			await NotificationsModel.create({
				title: title,
				body: body,
				userId: reservation.userId,
				unitId: reservation.unitId,
				reservationId: reservation.id,
				notificationStatus: "unseen",
			});
		}
	} catch (error) {
		console.error("Error creating notifications for starting reservations:", error);
	}
};

// Method to create notifications for reservations ending within the next 24 hours
export const checkoutNotifications = async () => {
	try {
		// Calculate the date and time for reservations ending within the next 24 hours
		const checkOutDate = moment().add(24, "hours").toDate();

		// Find reservations ending within the next 24 hours
		const endingReservations = await ReservationsModel.findAll({
			where: {
				checkOutDate: {
					[Op.between]: [moment().toDate(), checkOutDate],
				},
			},
		});

		// Create notifications for each reservation
		for (const reservation of endingReservations) {
			const title = `Checkout Reminder for ${reservation.customerName}`;
			const body = `Reservation for ${
				reservation.customerName
			} is ending on ${reservation.checkOutDate.toLocaleDateString()}. Please make sure to check them out on time.`;
			await NotificationsModel.create({
				title: title,
				body: body,
				userId: reservation.userId,
				unitId: reservation.unitId,
				reservationId: reservation.id,
				notificationStatus: "unseen",
			});
		}

		console.log("Notifications for ending reservations created successfully.");
	} catch (error) {
		console.error("Error creating notifications for ending reservations:", error);
	}
};
