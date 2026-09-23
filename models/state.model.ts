import mongoose, { Schema, Document } from "mongoose";

export interface IState extends Document {
    teacherId: mongoose.Types.ObjectId;
    studentId: mongoose.Types.ObjectId;
    //
    state: number;
    code: string;
    stack: number[];
    time: number;
    //
    createdAt?: Date;
    updatedAt?: Date;
}

const stateSchema = new Schema<IState>(
    {
        teacherId: {
            type: Schema.Types.ObjectId,
            ref: "Teacher",
            required: true,
        },
        studentId: {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        state: {
            type: Number,
            required: true,
        },
        code: {
            type: String,
            default: null,
        },
        stack: {
            type: [Number],
            default: [],
        },
        time: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const State = mongoose.model<IState>("State", stateSchema);
export default State;
