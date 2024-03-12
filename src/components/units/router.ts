import express, { Request, Response } from "express";
import authenticateMiddleware from "../../library/middlewares/auth";
import { upload } from "../../library/helpers/uploadImage";
import {
  createUnits,
  filterUnits,
  getAllAvailableUnits,
  getAllUnavailableUnits,
  getSingleUnit,
  searchUnits,
  unitsBeloningToUser,
  updateUnits,
  getUserUnitLocations,
  deleteSingleUnit,
} from "./unitsController";

const router = express.Router();

router.get("/users", (req: Request, res: Response) => {
  res.status(200).json({ message: "success" });
});
router.post(
  "/create-unit",
  authenticateMiddleware,
  upload.array("pictures", 6),
  createUnits
);
router.put(
  "/update-unit/:id",
  authenticateMiddleware,
  upload.array("pictures", 6),
  updateUnits
);
router.get("/my-units", authenticateMiddleware, unitsBeloningToUser);
router.get("/filter-units", authenticateMiddleware, filterUnits);
router.get("/search-units", authenticateMiddleware, searchUnits);
router.get("/unit/:id", authenticateMiddleware, getSingleUnit);
router.delete("/delete/:id", authenticateMiddleware, deleteSingleUnit);
router.get("/available-units", authenticateMiddleware, getAllAvailableUnits);
router.get(
  "/unavailable-units",
  authenticateMiddleware,
  getAllUnavailableUnits
);
router.get(
  "/units/user-locations",
  authenticateMiddleware,
  getUserUnitLocations
);

export default router;
