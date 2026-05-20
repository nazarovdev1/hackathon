import { apiGet } from "@/lib/api-client"
import { prisma } from "@/lib/prisma"
import {
  mapApiStudentToUser,
  mapAttendanceLog,
  mapApiSubject,
  mapAttendanceStatus,
} from "@/lib/mappers/attendance.mapper"
import type { AttendanceData } from "@/lib/api-types"

export async function syncAttendanceFromApi(externalStudentId: string) {
  const apiData = await apiGet<AttendanceData>(`/attendance/${externalStudentId}`)

  const existingUser = await prisma.user.findUnique({
    where: { externalId: apiData.student.id },
    include: { studentProfile: true },
  })

  let studentProfile = existingUser?.studentProfile

  if (!existingUser) {
    const userData = mapApiStudentToUser(apiData.student)

    const createdUser = await prisma.user.create({
      data: {
        ...userData,
        passwordHash: "$2b$10$dummyhashforsyncedusers",
        studentProfile: {
          create: {
            studentId: apiData.student.id,
            groupName: apiData.student.group,
            faculty: "Computer Science",
            level: "Undergraduate",
            grantType: "Merit",
          },
        },
      },
      include: { studentProfile: true },
    })

    studentProfile = createdUser.studentProfile
  }

  if (!studentProfile) {
    throw new Error("Student profile not found or could not be created")
  }

  for (const apiSubject of apiData.subjects) {
    const subject = await prisma.subject.upsert({
      where: { subjectId: apiSubject.subject_id },
      update: {
        name: apiSubject.subject_name,
        teacher: apiSubject.teacher,
      },
      create: mapApiSubject(apiSubject),
    })

    for (const log of apiSubject.logs) {
      const recordDate = new Date(`${log.date}T${log.time ?? "00:00:00"}`);
      const existingRecord = await prisma.attendanceRecord.findFirst({
        where: {
          studentId: studentProfile.id,
          date: recordDate,
          subjectId: subject.id,
        },
      });

      if (existingRecord) {
        await prisma.attendanceRecord.update({
          where: { id: existingRecord.id },
          data: {
            status: mapAttendanceStatus(log.status),
            reason: log.reason,
            time: log.time,
          },
        });
      } else {
        await prisma.attendanceRecord.create({
          data: mapAttendanceLog(log, studentProfile.id, subject.id),
        });
      }
    }
  }

  return {
    student: {
      id: studentProfile.id,
      name: existingUser?.fullName ?? apiData.student.first_name + " " + apiData.student.last_name,
      group: studentProfile.groupName,
      faculty: studentProfile.faculty,
    },
    summary: apiData.attendance_summary,
    syncedSubjects: apiData.subjects.length,
    syncedRecords: apiData.subjects.reduce((sum, s) => sum + s.logs.length, 0),
  }
}

export async function getStudentAttendance(studentId: string) {
  const student = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    include: {
      user: { select: { fullName: true, email: true } },
      attendanceRecords: {
        orderBy: { date: "desc" },
        include: { subjectRef: { select: { name: true, teacher: true } } },
      },
    },
  })

  if (!student) return null

  const records = student.attendanceRecords
  const total = records.length
  const attended = records.filter((r) => r.status === "PRESENT" || r.status === "LATE").length
  const absent = records.filter((r) => r.status === "ABSENT").length

  const subjects = new Map<string, { name: string; teacher: string; total: number; attended: number; absent: number; logs: unknown[] }>()

  for (const record of records) {
    const subjectKey = record.subjectId ?? "unknown"
    const subjectName = record.subjectRef?.name ?? record.subject ?? "Noma'lum fan"
    const teacher = record.subjectRef?.teacher ?? ""

    if (!subjects.has(subjectKey)) {
      subjects.set(subjectKey, {
        name: subjectName,
        teacher,
        total: 0,
        attended: 0,
        absent: 0,
        logs: [],
      })
    }

    const subject = subjects.get(subjectKey)!
    subject.total++

    if (record.status === "PRESENT" || record.status === "LATE") {
      subject.attended++
    } else {
      subject.absent++
    }

    subject.logs.push({
      date: record.date.toISOString().slice(0, 10),
      time: record.time,
      status: record.status.toLowerCase(),
      reason: record.reason,
    })
  }

  return {
    student: {
      id: student.studentId,
      name: student.user.fullName,
      group: student.groupName,
      faculty: student.faculty,
    },
    attendance_summary: {
      total_lessons: total,
      attended,
      absent,
      attendance_percentage: total > 0 ? Math.round((attended / total) * 1000) / 10 : 0,
    },
    subjects: Array.from(subjects.entries()).map(([id, data]) => ({
      subject_id: id,
      subject_name: data.name,
      teacher: data.teacher,
      subject_summary: {
        total: data.total,
        attended: data.attended,
        absent: data.absent,
        percentage: data.total > 0 ? Math.round((data.attended / data.total) * 1000) / 10 : 0,
      },
      logs: data.logs as { date: string; time: string | null; status: string; reason: string | null }[],
    })),
  }
}
