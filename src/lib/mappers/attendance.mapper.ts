import type {
  ApiStudent,
  AttendanceLog,
  ApiSubject,
  AttendanceStatus as ApiAttendanceStatus,
} from "@/lib/api-types"
import type { AttendanceStatus, Role } from "@prisma/client"

const statusMap: Record<ApiAttendanceStatus, AttendanceStatus> = {
  attended: "PRESENT",
  absent: "ABSENT",
  late: "LATE",
  excused: "EXCUSED",
}

export function mapAttendanceStatus(status: ApiAttendanceStatus): AttendanceStatus {
  return statusMap[status] ?? "ABSENT"
}

export function mapApiStudentToUser(apiStudent: ApiStudent) {
  return {
    externalId: apiStudent.id,
    fullName: `${apiStudent.first_name} ${apiStudent.last_name}`,
    email: `${apiStudent.id.toLowerCase()}@pdp.uz`,
    role: "STUDENT" as Role,
  }
}

export function mapAttendanceLog(
  log: AttendanceLog,
  studentDbId: string,
  subjectDbId?: string,
) {
  return {
    studentId: studentDbId,
    date: new Date(`${log.date}T${log.time ?? "00:00:00"}`),
    time: log.time,
    status: mapAttendanceStatus(log.status),
    reason: log.reason,
    subjectId: subjectDbId,
  }
}

export function mapApiSubject(apiSubject: ApiSubject) {
  return {
    subjectId: apiSubject.subject_id,
    name: apiSubject.subject_name,
    teacher: apiSubject.teacher,
  }
}
