export type ApiStatus = "success" | "error"

export interface ApiResponse<T> {
  status: ApiStatus
  message: string
  data: T
}

export type AttendanceStatus = "attended" | "absent" | "late" | "excused"

export interface AttendanceLog {
  date: string
  time: string
  status: AttendanceStatus
  reason: string | null
}

export interface SubjectSummary {
  total: number
  attended: number
  absent: number
  percentage: number
}

export interface ApiSubject {
  subject_id: string
  subject_name: string
  teacher: string
  subject_summary: SubjectSummary
  logs: AttendanceLog[]
}

export interface ApiStudent {
  id: string
  first_name: string
  last_name: string
  group: string
}

export interface AttendanceSummary {
  total_lessons: number
  attended: number
  absent: number
  attendance_percentage: number
}

export interface AttendanceData {
  student: ApiStudent
  attendance_summary: AttendanceSummary
  subjects: ApiSubject[]
}

export interface ApiEndpoints {
  attendance: "/attendance"
  students: "/students"
  sync: "/sync"
}
