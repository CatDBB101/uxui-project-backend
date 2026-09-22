import mongoose, { Schema, Document } from "mongoose";

export interface IStudent {
    teacherId: string | Schema.Types.ObjectId;
    username: string;
    password: string;
}

const teacherSchema = new Schema<IStudent>({
    teacherId: {
        type: Schema.Types.String || Schema.Types.ObjectId,
        ref: "Teacher",
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const Student = mongoose.model<IStudent>("Student", teacherSchema);
export default Student;
