export const TypeQuestionForm = ["multiple_choice", "message"] as const;
export type TQuestionForm = (typeof TypeQuestionForm)[number];
