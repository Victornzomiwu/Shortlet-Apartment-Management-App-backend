import dotenv from "dotenv";
dotenv.config();
import { Request } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { v4 as uuid } from "uuid";
import { UsersModel } from "../users/model";
import { generateToken } from "../../utils/utils";

export interface Profile {
  id: string;
  displayName: string;
  email: string;
  photos: [{ value: string }];
}

const strategy = GoogleStrategy;

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.log(process.env.GOOGLE_CLIENT_ID);
  throw new Error("Google OAuth client ID or client secret not provided.");
}

export const configureGoogleStrategy = () => {
  return new strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID! as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET! as string,
      callbackURL: "http://localhost:3000/google/callback",
      scope: ["profile", "email"],
      passReqToCallback: true,
    },
    async (
      request: Request,
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: any
    ) => {
      try {
        const user = await UsersModel.findOne({
          where: { googleId: profile.id, email: profile.email },
        });

        const userToken = await generateToken(
          profile.email,
          user?.dataValues.id
        );

        if (user) {
          // return done(null, profile);
          // console.log("token : ", userToken);
          return done(null, { ...user.toJSON(), userToken });
        }

        const id = uuid();
        const existingEmail = await UsersModel.findOne({
          where: { googleId: "", email: profile.email },
        });

        if (existingEmail) {
          const token = await generateToken(profile.email, existingEmail.id);
          // console.log("token: ", token);
          return done(null, { ...existingEmail.toJSON(), token });
        }

        const threeDaysInSeconds = 3 * 24 * 60 * 60;
        const nowInSeconds = Math.floor(Date.now() / 1000);

        const expiresAt = nowInSeconds + threeDaysInSeconds;

        const savedUser = new UsersModel({
          id,
          email: profile.email,
          fullname: profile.displayName,
          googleId: profile.id,
          phone: "",
          password: "",
          expiresAt: expiresAt,
        });

        const token = await generateToken(profile.email, savedUser.id);
        // console.log("token : ", token);

        await savedUser.save();

        // return done(null, savedUser);
        return done(null, { ...savedUser.toJSON(), token });
      } catch (error) {
        console.error(error);
        return done(error);
      }
    }
  );
};
