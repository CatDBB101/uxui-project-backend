export const TypeAccount = ["student", "teacher"] as const;
export type TAccount = (typeof TypeAccount)[number];
