import { Router, type Request, type Response } from "express";
import { Redis } from "@upstash/redis";
import type { questionForm } from "@/models/form.model";
import * as dotenv from "dotenv";
import Form from "@/models/form.model";
dotenv.config();

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const router = Router({ mergeParams: true });

// get form question
router.get("/", async (req: Request<{ state: string }>, res: Response) => {
    const { state } = req.query;

    const result = await redis.get(`form${state}`);
    res.send(result);
});
// update form question
router.patch(
    "/",
    async (
        req: Request<
            { state: string },
            null,
            {
                form: questionForm[];
            }
        >,
        res: Response,
    ) => {
        const { state } = req.query;
        const form = req.body.form;

        await redis.set(`form${state}`, JSON.stringify(form));
        const result = await redis.get(`form${state}`);

        res.send(result);
    },
);
// create form response
router.post(
    "/response",
    async (
        req: Request<
            null,
            null,
            {
                studentId: string;
                state?: number;
                answers: (string | number)[];
            }
        >,
        res: Response,
    ) => {
        const { studentId, state, answers } = req.body;

        const result = await Form.insertOne({
            studentId,
            state,
            answers,
        });

        res.send(result);
    },
);

export default router;
