import { type TQuestionForm } from "@/types/questionForm.type";
import mongoose, { Schema, Document } from "mongoose";

export interface questionForm {
    type: TQuestionForm;
    question: string;
    choices: string[];
}

export interface IForm extends Document {
    studentId: mongoose.Types.ObjectId;
    state: number;
    answers: (string | number)[];
}

const formSchema = new Schema<IForm>(
    {
        studentId: {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        state: {
            type: Number,
            default: -1,
        },
        answers: {
            type: [Schema.Types.Mixed],
            required: true,
            validate: {
                validator: function (v: any[]) {
                    if (!Array.isArray(v)) return false;
                    return v.every(
                        (item) =>
                            typeof item === "string" ||
                            typeof item === "number",
                    );
                },
                message: "Answers array can only contain strings and numbers.",
            },
        },
    },
    {
        timestamps: true,
    },
);

const Form = mongoose.model<IForm>("Form", formSchema);
export default Form;
