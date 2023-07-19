import { StudentViewModel } from "./StudentViewModel"
import { TeacherViewModel } from "./TeacherViewModel"

export class LessonsViewModel {
    constructor() {
        this.id = 0
        this.date = new Date()
        this.title = ''
        this.status = 0
        this.visitCount = 0
        this.students = []
        this.teachers = []
    }


    public id: number
    public date: Date
    public title: string
    public status: LessonStatusType
    public visitCount: number
    public students: Array<StudentViewModel>
    public teachers: Array<TeacherViewModel>
}

type LessonStatusType = 0 | 1