import { Router, type Request, type Response } from "express";
import Student from "@/models/student.models";
import Teacher from "@/models/teacher.models";
import { verifyCookieMiddleware } from "@/middlewares/cookie.middleware";
import State from "@/models/state.models";

const router = Router({ mergeParams: true });

// register
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
// login
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

        res.send(JSON.stringify({ type: "student", id: findUser[0]!._id }));
    },
);
// get student's state
router.get(
    "/state",
    verifyCookieMiddleware("student"),
    async (req: Request, res: Response) => {
        const user = (req as any).user;

        const states = await State.find({
            studentId: user._id,
        });

        res.send(states);
    },
);
// create student's state record
router.post(
    "/state",
    verifyCookieMiddleware("student"),
    async (
        req: Request<
            any,
            any,
            {
                state: number;
                code?: string;
                time: number;
            }
        >,
        res: Response,
    ) => {
        const { state, code, time } = req.body;
        const user = (req as any).user;

        const states = await State.insertOne({
            teacherId: user.teacherId,
            studentId: user._id,
            state: state,
            code,
            time,
        });

        res.send(states);
    },
);

router.get("/", async (req: Request, res: Response) => {
    const teacher = await Student.find({});
    res.send(teacher);
});

export default router;
