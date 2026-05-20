import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { syncAttendanceFromApi, getStudentAttendance } from "@/services/attendance.service";
import { getCurrentStudentDashboard } from "@/services/dashboard-data";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ status: "error", message: "Unauthorized", data: null }, { status: 401 });
  }

  try {
    const student = await getCurrentStudentDashboard();
    if (!student) {
      return NextResponse.json({ status: "error", message: "Student not found", data: null }, { status: 404 });
    }

    const attendanceData = await getStudentAttendance(student.id);
    if (!attendanceData) {
      return NextResponse.json({ status: "error", message: "Attendance data not found", data: null }, { status: 404 });
    }

    return NextResponse.json({
      status: "success",
      message: "Davomat ma'lumotlari muvaffaqiyatli yuklandi",
      data: attendanceData,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Noma'lum xatolik";
    return NextResponse.json({ status: "error", message, data: null }, { status: 500 });
  }
}

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ status: "error", message: "Unauthorized", data: null }, { status: 401 });
  }

  try {
    const student = await getCurrentStudentDashboard();
    if (!student) {
      return NextResponse.json({ status: "error", message: "Student not found", data: null }, { status: 404 });
    }

    const externalId = student.studentId;
    const result = await syncAttendanceFromApi(externalId);

    return NextResponse.json({
      status: "success",
      message: "Talaba davomati muvaffaqiyatli yuklandi",
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Noma'lum xatolik";
    return NextResponse.json({ status: "error", message, data: null }, { status: 500 });
  }
}
