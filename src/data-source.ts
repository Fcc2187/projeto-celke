import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";
import { User } from "./entity/User.js";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: process.env.DB_PASSWORD ?? "",
    database: "celke",
    synchronize: true,
    logging: true,
    entities: [User],
    migrations: ["dist/migration/*.js"],
    subscribers: [""],
});

AppDataSource.initialize().then(() => {
  console.log("Data Source has been initialized!");
}).catch((err) => {
  console.error("Error during Data Source initialization:", err);
});
