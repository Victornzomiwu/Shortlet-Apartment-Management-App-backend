import { Sequelize } from "sequelize";

const db = new Sequelize(process.env.DB_NAME as string, process.env.DB_USER as string, process.env.DB_PASSWORD as string, {
	dialect: "mysql",
	host: process.env.DB_HOST,
	port: parseInt(process.env.DB_PORT as string),
	dialectOptions: {
		ssl: {
			require: true,
			rejectUnauthorized: false,
		},
	},
	logging: false,
});

export default db;
