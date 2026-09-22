import mongoose, { Schema, Document } from "mongoose";

export interface ITeacher {
    username: string;
    password: string;
}

const teacherSchema = new Schema<ITeacher>({
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

const Teacher = mongoose.model<ITeacher>("Teacher", teacherSchema);
export default Teacher;
