import express, { type Express, type Request, type Response } from "express";
import { connectDB } from "@/services/db.ts";
import * as dotenv from "dotenv";
dotenv.config();

import TeacherRouter from "@/routes/teacher.route.ts";
import StudentRouter from "@/routes/student.route.ts";
import { verifyCookieMiddleware } from "./middlewares/cookie.middleware";

connectDB(process.env.DB_URI!);

const app: Express = express();
const port = 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.use("/teachers", TeacherRouter);
app.use("/students", StudentRouter);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
