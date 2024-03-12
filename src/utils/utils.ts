import bcryptjs, { genSalt } from "bcryptjs";
import Joi from "joi";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

//I have created these functions to reduce repetition and reduce code length
//kindly use the functions to do yout basic verification and authentication

// generate token
export const generateToken = async (email: string, id: string) => {
  return Jwt.sign({ email, id }, process.env.JWT_SECRET as string, {
    expiresIn: "3d",
  });
};

// validate token
export const verify = async (token: string) => {
  try {
    const verified = Jwt.verify(token, process.env.JWT_SECRET as string);
    return verified;
  } catch (error) {
    return "invalid token";
  }
};

//Encoding
export const bcryptEncoded = async (value: { value: string }) => {
  return bcryptjs.hash(value.value, await genSalt());
};

//decoding
export const bcryptDecode = (password: string, comparePassword: string) => {
  return bcryptjs.compare(password, comparePassword);
};

export const generatePasswordResetToken = (): number => {
  return Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
};

//hashing
export const hashPassword = (password: string): Promise<string> => {
  return bcryptjs.hash(password, bcryptjs.genSaltSync());
};

export const option = {
  abortEarly: false,
  errors: {
    wrap: {
      label: "",
    },
  },
};

export const registerUserSchema = Joi.object().keys({
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.base": "Email should be a string",
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),
  firstName: Joi.string().required().messages({
    "string.base": "First Name should be a string",
    "string.empty": "First Name is required",
  }),
  surname: Joi.string().required().messages({
    "string.base": "Surname should be a string",
    "string.empty": "Surname is required",
  }),
  password: Joi.string()
    .trim()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#_!*%$])[a-zA-Z0-9@#_!*%$]{3,18}$/
    )
    .required()
    .messages({
      "string.base": "Password should be a string",
      "string.empty": "Password is required",
      "string.pattern.base": "Invalid password format",
    }),
  confirm_password: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm password")
    .messages({
      "any.only": "Passwords do not match",
    }),
  phone: Joi.string().required().messages({
    "string.base": "Phone Number should be a string",
    "string.empty": "Phone Number is required",
  }),
});

export const resetPasswordSchema = Joi.object().keys({
  email: Joi.string().trim().lowercase().email().required(),
  code: Joi.number().required(),
  password: Joi.string().required(),
  confirm_password: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm password")
    .messages({ "any.only": "{{#label}} does not match" }),
});

export const forgotPasswordSchema = Joi.object().keys({
  email: Joi.string().trim().lowercase().required(),
});

export const resendResetPasswordOtpSchema = Joi.object().keys({
  email: Joi.string().trim().lowercase().required(),
});

export const loginUserSchema = Joi.object().keys({
  email: Joi.string().trim().lowercase().required(),
  password: Joi.string()
    .trim()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#_!*%$])[a-zA-Z0-9@#_!*%$]{3,18}$/
    )
    .required()
    .messages({
      "string.base": "Password should be a string",
      "string.empty": "Password is required",
      "string.pattern.base": "Invalid password format",
    }),
});

//=============================== Units Schema ===============================/

export const createUnitsSchema = Joi.object().keys({
  name: Joi.string().required(),
  number: Joi.string().required(),
  status: Joi.string().required(),
  numberOfBedrooms: Joi.string().required(),
  price: Joi.string().required(),
  pictures: Joi.array().items(Joi.string()),
  type: Joi.string(),
  location: Joi.string().required(),
  description: Joi.string().required(),
});

export const updateUnitsSchema = Joi.object().keys({
  name: Joi.string(),
  number: Joi.string(),
  status: Joi.string(),
  numberOfBedrooms: Joi.number(),
  price: Joi.number(),
  pictures: Joi.array().items(Joi.string()),
  type: Joi.string(),
  location: Joi.string(),
  description: Joi.string(),
});

export const createReservationSchema = Joi.object().keys({
  customerName: Joi.string().required(),
  customerEmail: Joi.string().trim().lowercase().email().required(),
  customerPhone: Joi.string().required(),
  checkInDate: Joi.date().required(),
  // location: Joi.string().required(),
  checkOutDate: Joi.date().required(),
  // status: Joi.string().max(255).optional(),
  unitId: Joi.string().required(), // Make unitId optional in the schema
});

export const updateReservationSchema = Joi.object().keys({
  customerName: Joi.string(),
  // location: Joi.string().required(),
  customerEmail: Joi.string().trim().lowercase().email(),
  customerPhone: Joi.string(),
  checkInDate: Joi.date(),
  checkOutDate: Joi.date(),
  // status: Joi.string(),
});
