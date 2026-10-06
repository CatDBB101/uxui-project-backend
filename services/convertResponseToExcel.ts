import ExcelJS from "exceljs";
import type { Response } from "express";
import type { IResponse } from "@/models/response.model";

export async function sendExcelResponse(
    responses: IResponse[],
    res: Response,
    fileName: string = "Responses.xlsx",
): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Responses Data");

    // Changed "Workshop ID" to "Workshop Name"
    worksheet.columns = [
        { header: "Response ID", key: "_id", width: 25 },
        { header: "Teacher Name", key: "teacherName", width: 25 },
        { header: "Workshop Name", key: "workshopName", width: 25 },
        { header: "Student Name", key: "studentName", width: 25 },
        { header: "Code", key: "code", width: 20 },
        { header: "Stack", key: "stack", width: 20 },
        { header: "Time", key: "time", width: 15 },
        { header: "Created At", key: "createdAt", width: 25 },
        { header: "Updated At", key: "updatedAt", width: 25 },
    ];

    worksheet.getRow(1).font = { bold: true };

    responses.forEach((response) => {
        worksheet.addRow({
            _id: (response as any)._id?.toString() || "",
            teacherName:
                (response.teacherId as any)?.username ||
                response.teacherId?.toString() ||
                "",
            studentName:
                (response.studentId as any)?.username ||
                response.studentId?.toString() ||
                "",

            // Extract the workshop name if populated, fallback to ID if not
            workshopName:
                (response.workshopId as any)?.name ||
                response.workshopId?.toString() ||
                "",

            code: response.code || "",
            stack: Array.isArray(response.stack)
                ? response.stack.join(", ")
                : "",
            time: response.time,
            createdAt: response.createdAt
                ? new Date(response.createdAt).toLocaleString()
                : "",
            updatedAt: response.updatedAt
                ? new Date(response.updatedAt).toLocaleString()
                : "",
        });
    });

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    await workbook.xlsx.write(res);
    res.end();
}
