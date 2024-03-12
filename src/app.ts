import dotenv from "dotenv";
dotenv.config();
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import session from "express-session";
import logger from "morgan";
import passport from "passport";
import cron from "node-cron";

import { configureGoogleStrategy } from "./components/OAuth";
import router from "./routes";
import { UsersModel } from "./components/users/model";
import { generateToken } from "./utils/utils";
import { checkinNotifications, checkoutNotifications } from "./components/notifications/notificationsSchedule";

const app = express();

app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
// secure apps. should be placed before any authentication middleware
app.use(helmet());
// enable cors
app.use(
	cors()
	//   {
	//   origin: "http://localhost:5173",
	//   methods: "GET,POST,PUT,DELETE",
	//   credentials: true,
	// }
);

const sessionSecret = process.env.SECRET || "defaultSecret";

app.use(
	session({
		secret: [sessionSecret],
		resave: false,
		saveUninitialized: true,
	})
);

app.use(passport.initialize());
app.use(passport.session());

passport.use("google", configureGoogleStrategy());
passport.deserializeUser((user: Express.User, done) => {
	done(null, user);
});

passport.serializeUser((user, done) => {
	done(null, user);
});

// Google Authentication routes
// app.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["email", "profile"] })
// );
app.get(
	"/auth/google",
	passport.authenticate("google", {
		prompt: "select_account",
		scope: ["email", "profile"],
	})
);

app.get(
	"/google/callback",
	passport.authenticate("google", {
		// successRedirect: "/auth/success",
		successRedirect: "http://localhost:5173/",
		// failureRedirect: "/auth/failure",
		failureRedirect: "http://localhost:5173/",
	})
);

app.get("/auth/success", async (req: Request, res: Response) => {
	if (req.user) {
		const user = req.user as UsersModel;
		const id = user.id;
		const email = user.email;
		const token = await generateToken(email, id);
		res.status(200).json({
			error: false,
			message: "Successfully Logged in",
			user: req.user,
			token,
		});

		// return res.redirect(`http://localhost:5173/?token=${token}`);
	} else {
		res.status(403).json({ error: true, message: "Not authorized" });
	}
});
app.get("/auth/failure", async (req: Request, res: Response) => {
	res.status(401).json({ error: true, message: "Login Failed..." });
});

app.get("/logout", (req: Request, res: Response) => {
	req.session.destroy(() => {
		// console.log("User Logged out");
		res.redirect("/login");
	});
});

app.use(router);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(500).send("Internal Server Error");
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
	res.status(404).send("Not Found");
});

// Schedule the cron jobs
cron.schedule("0 1 * * *", () => {
	checkinNotifications();
	checkoutNotifications();
});

export default app;

