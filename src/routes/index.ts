import express, { Request, Response, Router } from "express";
import component from "../components";

const router: Router = express.Router();

router.use("/api", component.units.routes);
router.use("/api", component.users.routes);
router.use("/api", component.reservations.routes);
router.use("/api", component.notificationStatus.routes);

export default router;
