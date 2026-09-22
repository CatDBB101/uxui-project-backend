import { Router, type Request, type Response } from "express";
import Teacher from "@/models/teacher.models";

const router = Router({ mergeParams: true });

router.post(
    "/register",
    async (
        req: Request<
            null,
            null,
            {
                username: string;
                password: string;
            }
        >,
        res: Response,
    ) => {
        const { username, password } = req.body;

        let result;
        try {
            result = await Teacher.insertOne({
                username,
                password,
            });
        } catch (error) {
            return res.send(error);
        }

        res.send(result);
    },
);

router.post(
    "/login",
    async (
        req: Request<
            null,
            null,
            {
                username: string;
                password: string;
            }
        >,
        res: Response,
    ) => {
        const { username, password } = req.body;

        const findName = await Teacher.find({ username });
        if (findName.length == 0) {
            return res.status(404).send({ message: "not found username" });
        }

        const findUser = await Teacher.find({ username, password });
        if (findUser.length == 0) {
            return res.status(401).send({ message: "incorrect password" });
        }

        res.send(
            JSON.stringify({ type: "teacher", id: findUser[0]!.username }),
        );
    },
);

router.get("/", async (req: Request, res: Response) => {
    const teacher = await Teacher.find({});
    res.send(teacher);
});

export default router;
