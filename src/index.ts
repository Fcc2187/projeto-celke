import express, {type Request,type Response} from "express";
import UsersController from "./controllers/UsersController.js";

const app = express();

app.use(express.json());

app.use("/", UsersController);

app.get("/", (req: Request, res: Response) => {
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
