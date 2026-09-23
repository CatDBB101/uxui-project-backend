import { Router, type Request, type Response } from "express";
import Student from "@/models/student.model";
import Teacher from "@/models/teacher.model";
import { verifyCookieMiddleware } from "@/middlewares/cookie.middleware";
import State from "@/models/state.model";
import Workshop from "@/models/workshop.model";
import ResponseModel from "@/models/response.model";

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
                stack?: number[];
                time: number;
            }
        >,
        res: Response,
    ) => {
        const { state, code, stack, time } = req.body;
        const user = (req as any).user;

        const states = await State.insertOne({
            teacherId: user.teacherId,
            studentId: user._id,
            state: state,
            stack,
            code,
            time,
        });

        res.send(states);
    },
);
// get workshop list
router.get(
    "/workshops",
    verifyCookieMiddleware("student"),
    async (req: Request, res: Response) => {
        const student = (req as any).user;
        const teacherId = student.teacherId;

        const workshop = await Workshop.find({ teacherId });

        res.send(workshop);
    },
);
// create workshop response
router.post(
    "/responses",
    verifyCookieMiddleware("student"),
    async (
        req: Request<
            any,
            any,
            {
                workshopId: string;
                code?: string;
                stack?: number[];
                time: number;
            }
        >,
        res: Response,
    ) => {
        const student = (req as any).user;
        const studentId = student._id;
        const teacherId = student.teacherId;

        const { workshopId, stack, code, time } = req.body;

        const result = await ResponseModel.insertOne({
            teacherId,
            workshopId,
            studentId,
            code,
            stack,
            time,
        });

        res.send(result);
    },
);
// get workshop responses
router.get(
    "/responses",
    verifyCookieMiddleware("student"),
    async (req: Request, res: Response) => {
        const student = (req as any).user;
        const studentId = student._id;
        const responses = await ResponseModel.find({ studentId });
        res.send(responses);
    },
);

export default router;
