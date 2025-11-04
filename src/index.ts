import express, {type Request,type Response} from "express";
import { AppDataSource } from "./data-source.js";

const app = express();

AppDataSource.initialize().then(() => {
  console.log("Data Source has been initialized!");
}).catch((err) => {
  console.error("Error during Data Source initialization:", err);
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Manos!");
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
