import express, { Request, Response } from "express";
import {
  forgotPassword,
  login,
  logout,
  registerUser,
  sendResetPasswordOtp,
  resetPassword,
  getUsers,
} from "./usersController";
import authenticateMiddleware from "../../library/middlewares/auth";

const router = express.Router();

router.get("/home", (req: Request, res: Response) => {
  res.status(200).json({ message: "success" });
});

router.post("/register", registerUser);
router.post("/login", login);
router.post("/logout", logout);
router.post("/sendResetPasswordOtp", sendResetPasswordOtp);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);
router.get("/getAllUsers", authenticateMiddleware, getUsers);

export default router;
