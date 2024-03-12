import { Sequelize, DataTypes, Model } from "sequelize";
import db from "../../db";
import { UsersModel } from "../users/model";

class UnitsModel extends Model {
  public id!: string;
  public name!: string;
  public number!: string;
  public status!: "available" | "occupied";
  public numberOfBedrooms!: string;
  public price!: string;
  public pictures?: string[];
  public type?: string;
  public userId?: string;
  public location!: string;
  public description!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

UnitsModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM("available", "occupied"),
      defaultValue: "available",
    },
    numberOfBedrooms: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.STRING,
    },

    pictures: {
  type: DataTypes.STRING(2048),
  get() {
    if (this.getDataValue("pictures")) {
      return this.getDataValue("pictures").split(",");
    }
  }
},

    type: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.UUID,
    },
    location: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
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
    modelName: "UnitsModel",
    tableName: "units",
    timestamps: true,
  }
);

UnitsModel.belongsTo(UsersModel, { foreignKey: "userId" });

export { db, UnitsModel };
