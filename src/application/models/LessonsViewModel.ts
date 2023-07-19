import { StudentViewModel } from "./StudentViewModel"
import { TeacherViewModel } from "./TeacherViewModel"
import moment from 'moment'

export class LessonsViewModel {
    constructor(
        lesson: LessonsViewModel
    ) {
        this.id = lesson.id
        this.date = moment(lesson.date).format('YYYY-MM-DD')
        this.title = lesson.title
        this.status = lesson.status
        this.visitsCount = Number(lesson.visitsCount)
        this.students = lesson.students
        this.teachers = lesson.teachers
    }


    public id: number
    public date: Date | string
    public title: string
    public status: LessonStatusType
    public visitsCount: number
    public students: Array<StudentViewModel>
    public teachers: Array<TeacherViewModel>
}

type LessonStatusType = 0 | 1