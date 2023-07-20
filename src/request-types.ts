import { Request } from 'express'

export type GetLessonsQueryType = {
    date: string
    status: string
    teacherIds: string
    studentsCount: string
    page: string
    lessonsPerPage: string
}

export type RequestWithQuery<T> = Request<{}, {}, {}, T>
