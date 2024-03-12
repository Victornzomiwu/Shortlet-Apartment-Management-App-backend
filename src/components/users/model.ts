import { Sequelize, DataTypes, Model } from "sequelize";
import db from "../../db";

class UsersModel extends Model {
  public id!: string;
  public firstName!: string;
  public surname!: string;
  public email!: string;
  public password!: string;
  public phone!: string;

  // Google-specific fields
  public googleId?: string;
  public googleAccessToken?: string;

  // Profile information
  public displayName?: string;
  public profilePicture?: string;

  // Authentication related
  public authProvider?: string;

  // Forget/Reset Password fields
  public resetPasswordExpiration?: number | null;
  public resetPasswordStatus?: boolean;
  public resetPasswordCode!: string | null;

  public createdAt?: Date;
  public updatedAt?: Date;
}

UsersModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    surname: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fullname: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    googleAccessToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    authProvider: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpiration: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: null,
    },
    resetPasswordStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    resetPasswordCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: db,
    modelName: "UsersModel",
    tableName: "users",
    timestamps: true,
  }
);

export { db, UsersModel };
