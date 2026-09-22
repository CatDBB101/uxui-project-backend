import { Router, type Request, type Response } from "express";
import Student from "@/models/student.models";
import Teacher from "@/models/teacher.models";

const router = Router({ mergeParams: true });

router.post(
    "/register",
    async (
        req: Request<
            null,
            null,
            {
                teacherId: string;
                username: string;
                password: string;
            }
        >,
        res: Response,
    ) => {
        const { teacherId, username, password } = req.body;

        const isTeacherExist = await Teacher.findById(teacherId);
        if (isTeacherExist === null) {
            return res.status(404).send({
                message: "not found teacher",
            });
        }

        let result;
        try {
            result = await Student.insertOne({
                teacherId,
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

        const findName = await Student.find({ username });
        if (findName.length == 0) {
            return res.status(404).send({ message: "not found username" });
        }

        const findUser = await Student.find({ username, password });
        if (findUser.length == 0) {
            return res.status(401).send({ message: "incorrect password" });
        }

        res.send(
            JSON.stringify({ type: "student", id: findUser[0]!._id }),
        );
    },
);

router.get("/", async (req: Request, res: Response) => {
    const teacher = await Student.find({});
    res.send(teacher);
});

export default router;
