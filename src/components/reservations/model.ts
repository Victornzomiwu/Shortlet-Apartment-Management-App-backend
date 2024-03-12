import { Sequelize, DataTypes, Model } from "sequelize";
import db from "../../db";
import { UsersModel } from "../users/model";
import { UnitsModel } from "../units/model";

class ReservationsModel extends Model {
  public id!: string;
  public customerName!: string;
  public customerEmail!: string;
  public customerPhone!: string;
  public checkInDate!: Date;
  public checkOutDate!: Date;
  public userId!: string;
  public unitId!: string | null;
  public status!: "cancelled" | "stayed" | "reserved" | "in-residence";
  public createdAt!: Date;
  public updatedAt!: Date;
}

ReservationsModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    checkInDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    checkOutDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    unitId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("cancelled", "stayed", "reserved", "in-residence"),
      defaultValue: "reserved",
      allowNull: false,
      validate: {
        isIn: {
          args: [["cancelled", "stayed", "reserved", "in-residence"]],
          msg: "Invalid status value",
        },
      },
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
    modelName: "ReservationsModel",
    tableName: "reservations",
    timestamps: true,
  }
);

ReservationsModel.belongsTo(UsersModel, { foreignKey: "userId" });
UnitsModel.hasMany(ReservationsModel, { foreignKey: "unitId" });

export { db, ReservationsModel };
