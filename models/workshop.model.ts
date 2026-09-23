import { TypeStack, type TStack } from "@/types/stack.type";
import mongoose, { Schema, Document } from "mongoose";

export interface IWorkshop {
    name: string;
    teacherId: string | Schema.Types.ObjectId;
    playerHp: number;
    enemyHp: number;
    inventory: [number];
    stack: TStack;
    hint: string;
    code: string;
}

const workshopSchema = new Schema<IWorkshop>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    teacherId: {
        type: Schema.Types.String || Schema.Types.ObjectId,
        ref: "Teacher",
        required: true,
    },
    playerHp: {
        type: Number,
        default: 3,
    },
    enemyHp: {
        type: Number,
        default: 10,
    },
    inventory: {
        type: [Number],
        default: [],
    },
    stack: {
        type: String,
        enum: TypeStack,
        default: "array",
    },
    hint: {
        type: String,
        default: "",
    },
    code: {
        type: String,
        default: "",
    },
});

const Workshop = mongoose.model<IWorkshop>("Workshope", workshopSchema);
export default Workshop;
