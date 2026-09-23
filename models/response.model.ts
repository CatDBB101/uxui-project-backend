import mongoose, { Schema, Document } from "mongoose";

export interface IResponse extends Document {
    teacherId: mongoose.Types.ObjectId;
    workshopId: mongoose.Types.ObjectId;
    studentId: mongoose.Types.ObjectId;
    //
    code: string;
    stack: number[];
    time: number;
    //
    createdAt?: Date;
    updatedAt?: Date;
}

const responseSchema = new Schema<IResponse>(
    {
        teacherId: {
            type: Schema.Types.ObjectId,
            ref: "Teacher",
            required: true,
        },
        workshopId: {
            type: Schema.Types.ObjectId,
            ref: "Workshop",
            required: true,
        },
        studentId: {
            type: Schema.Types.ObjectId,
            ref: "Student",
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

const Response = mongoose.model<IResponse>("Response", responseSchema);
export default Response;
