import express, { Request, Response } from "express";
import authenticateMiddleware from "../../library/middlewares/auth";
import {
  createReservation,
  updateReservation,
  reservationBelongingToUser,
  reservationBelongingToUnit,
  getSingleReservation,
  checkIn,
  checkOut,
  cancell,
} from "./reservationsController";

const router = express.Router();

router.get("/reservations", (req: Request, res: Response) => {
  res.status(200).json({ message: "success" });
});
router.post("/create-reservation", authenticateMiddleware, createReservation);
router.put(
  "/update-reservation/:id",
  authenticateMiddleware,
  updateReservation
);
router.get(
  "/reservations/user",
  authenticateMiddleware,
  reservationBelongingToUser
);
router.get(
  "/reservations/unit/:unitId",
  authenticateMiddleware,
  reservationBelongingToUnit
);
router.get(
  "/single-reservations/:id",
  authenticateMiddleware,
  getSingleReservation
);
router.put("/check-in/:id", authenticateMiddleware, checkIn);
router.put("/check-out/:id", authenticateMiddleware, checkOut);
router.put("/cancell/:id", authenticateMiddleware, cancell);

export default router;
