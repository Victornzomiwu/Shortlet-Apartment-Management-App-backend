import {
	registerUserSchema,
	option,
	hashPassword,
	loginUserSchema,
	bcryptDecode,
	generateToken,
	resendResetPasswordOtpSchema,
	resetPasswordSchema,
	bcryptEncoded,
	forgotPasswordSchema,
} from "../../utils/utils";
import { Request, Response } from "express";
import { UsersModel } from "./model";
import { v4 as uuidv4 } from "uuid";
import generateVerifcationOTP from "../../library/helpers/generateVerifcationOTP";
import sendResetOTP from "../../library/helpers/requestResetOTP";

// -------------------------------------------REGISTER USERS----------------------------------------
export const registerUser = async (req: Request, res: Response) => {
	try {
		const { email, firstName, surname, password, phone } = req.body;
		// console.log(req.body);

		const validate = registerUserSchema.validate(req.body, option);

		if (validate.error) {
			return res.status(400).json({ Error: validate.error.details[0].message });
		}

		const exists = await UsersModel.findOne({ where: { email } });

		if (exists) {
			return res.status(400).json({ message: "email already exists" });
		}

		const id = uuidv4();

		const newUser = await UsersModel.create({
			...validate.value,
			id,
			password: await hashPassword(password),
		});

		return res.status(201).json({
			newUser,
			message: "user created successfully",
		});
	} catch (error) {
		console.error("Error during user registration:", error);
		return res.status(500).json({ message: "something went wrong" });
	}
};

export const logout = async (req: Request, res: Response) => {
	req.session.destroy(() => {
		return res.status(200).json({ message: "Logout successful. Come back soon!" });
	});
};

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		const validate = loginUserSchema.validate(req.body, option);

		if (validate.error) {
			return res.status(400).json({ Error: validate.error.details[0].message });
		}

		const exists = await UsersModel.findOne({
			where: { email },
		});
		if (!exists) {
			return res.status(400).json({ message: "invalid credentials" });
		}

		const user = exists.dataValues;
		const { firstName } = user;
		// console.log("This is the USER DETAILS ..... ", user);

		const validPassword = await bcryptDecode(password, exists.password);
		if (!validPassword) {
			return res.status(400).json({ message: "invalid credentials" });
		}

		const token = await generateToken(email, exists.dataValues.id);

		return res.status(200).json({ token, message: "login successful", firstName });
	} catch (error) {
		console.error("Error during login:", error);
		return res.status(500).json({ message: "something went wrong" });
	}
};

// ============================ RESET PASSWORD SECTION ===================== //
// ============================ ==================== ===================== //

export const forgotPassword = async (req: Request, res: Response) => {
	try {
		const validate = forgotPasswordSchema.validate(req.body, option);
		if (validate.error) {
			return res.status(400).json({ error: validate.error.details[0].message });
		}
		const email = req.body;

		const user = await UsersModel.findOne({ where: email });

		if (!user) return res.status(400).json({ error: "Invalid credentials" });

		const OTP = generateVerifcationOTP();

		const receiver = user.dataValues.email;
		sendResetOTP(receiver, OTP);

		const userReset = await UsersModel.update(
			{
				resetPasswordCode: OTP,
				resetPasswordStatus: true,
				resetPasswordExpiration: Date.now() + 600000,
			},
			{ where: email }
		);

		return res.status(200).json({
			message: "Password Reset Successful. Check your email to reset your password",
		});
	} catch (error) {
		res.status(500).json(error);
	}
};

export const resetPassword = async (req: Request, res: Response) => {
	try {
		const { email, code, password } = req.body;
		const validationResult = resetPasswordSchema.validate(req.body, option);
		if (validationResult.error) {
			return res.status(400).json({ error: validationResult.error.details[0].message });
		}
		const user = await UsersModel.findOne({
			where: { email },
		});
		if (!user) return res.status(400).json({ error: "Invalid credentials" });
		console.log(user);
		if (user.resetPasswordCode !== code) {
			return res.status(400).json({ error: "Invalid OTP" });
		}
		if (user.resetPasswordExpiration && (user.resetPasswordExpiration as number) < new Date().getTime()) {
			return res.status(400).json({ error: "OTP expired. Please generate a new OTP" });
		}
		const hash = await bcryptEncoded({ value: password });

		const userEmail = await UsersModel.update(
			{
				password: hash,
				resetPasswordStatus: false,
				resetPasswordCode: null,
				resetPasswordExpiration: null,
			},
			{ where: { id: user.id } }
		);
		if (!userEmail) {
			let info: { [key: string]: string } = {
				error: "Invalid credentials",
			};
			throw new Error(info.error);
		}

		return res.status(200).json({ message: "SUCCESS" });
	} catch (error) {
		return res.status(500).json(error);
	}
};

// ============================ SEND RESET PASSWORD OTP SECTION ===================== //
// ============================ ==================== ===================== //

export const sendResetPasswordOtp = async (req: Request, res: Response) => {
	try {
		const { email } = req.body;

		const validation = resendResetPasswordOtpSchema.validate(req.body, option);

		if (validation.error) {
			return res.status(400).json({ error: validation.error.details[0].message });
		}

		const user = await UsersModel.findOne({
			where: { email: email },
		});

		if (!user) {
			return res.status(400).json({ error: "Invalid credentials" });
		}

		const OTP = generateVerifcationOTP();

		await UsersModel.update(
			{
				resetPasswordCode: OTP,
				resetPasswordStatus: true,
				resetPasswordExpiration: Date.now() + 5 * 60 * 1000,
			},
			{ where: { email: email } }
		);

		console.log(user);

		await sendResetOTP(email, OTP);
		return res.status(200).json({ user, message: "SUCCESS" });
	} catch (error) {
		return res.status(500).json({
			error,
		});
	}
};

// -------------------------------------------GET ALL USERS----------------------------------------
export const getUsers = async (req: Request, res: Response) => {
	try {
		const users = await UsersModel.findAll({});
		return res.status(200).json({ users, message: "You have successfully retrieved all users" });
	} catch (error) {
		console.error("Error fetching users:", error);
		return res.status(500).json({ error, message: "error fetching users" });
	}
};
