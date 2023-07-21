export type CreateLessonsInputModel = {
    teacherIds: number[]
    title: string
    days: number[]
    firstDate: string
    lessonsCount?: number
    lastDate?: string
}