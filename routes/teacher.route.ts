import { Router, type Request, type Response } from "express";
import Teacher from "@/models/teacher.model";
import { verifyCookieMiddleware } from "@/middlewares/cookie.middleware";
import State from "@/models/state.model";
import type { TStack } from "@/types/stack.type";
import Workshop from "@/models/workshop.model";
import ResponseModel from "@/models/response.model";

const router = Router({ mergeParams: true });

// teacher register
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
// teacher login
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

        res.send(JSON.stringify({ type: "teacher", id: findUser[0]!._id }));
    },
);
// get teacher's students states
router.get(
    "/states",
    verifyCookieMiddleware("teacher"),
    async (req: Request, res: Response) => {
        const teacher = (req as any).user;
        const teacherId = teacher._id;

        const states = await State.find({ teacherId });
        res.send(states);
    },
);

// create workshop
router.post(
    "/workshops",
    verifyCookieMiddleware("teacher"),
    async (
        req: Request<
            any,
            any,
            {
                name: string;
                playerHp?: number;
                enemyHp?: number;
                inventory?: [number];
                stack?: TStack;
                hint?: string;
                code?: string;
            }
        >,
        res: Response,
    ) => {
        const teacher = (req as any).user;
        const teacherId = teacher._id;
        const { name, playerHp, enemyHp, inventory, stack, hint, code } =
            req.body;

        var result;

        try {
            result = await Workshop.insertOne({
                name,
                teacherId,
                playerHp,
                enemyHp,
                inventory,
                stack,
                hint,
                code,
            });
        } catch (error) {
            return res
                .status(400)
                .send({ message: "workshop name already exist" });
        }

        res.send(result);
    },
);
// get workshop list
router.get(
    "/workshops",
    verifyCookieMiddleware("teacher"),
    async (req: Request, res: Response) => {
        const teacher = (req as any).user;
        const teacherId = teacher._id;

        const workshop = await Workshop.find({ teacherId });

        res.send(workshop);
    },
);
// get workshop's student response
router.get(
    "/responses",
    verifyCookieMiddleware("teacher"),
    async (req: Request, res: Response) => {
        const teacher = (req as any).user;
        const teacherId = teacher._id;
        const responses = await ResponseModel.find({
            teacherId,
        });
        res.send(responses);
    },
);

export default router;
