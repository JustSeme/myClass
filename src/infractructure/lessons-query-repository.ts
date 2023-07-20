import { injectable } from "inversify"
import { client } from "../repositories/db"
import { GetLessonsQueryType } from "../request-types"
import { LessonsViewModel } from "../application/models/LessonsViewModel"
import { filterByStatus, filterByStudentsCount, prepareStudentsCountParam } from "../helpers"

@injectable()
export class LessonsQueryRepository {

    async findLessons(lessonsQueryParams: GetLessonsQueryType): Promise<LessonsViewModel[]> {
        let {
            date = null, status = -1, teacherIds = '', studentsCount = '', page = 1, lessonsPerPage = 5
        } = lessonsQueryParams

        const datesArray = date?.split(',')
        const teacherIdsArray = teacherIds.split(',')
        const preparedStudentCount = prepareStudentsCountParam(studentsCount)
        const skipCount = (+page - 1) * +lessonsPerPage

        const queryString = `
        SELECT l.*,
        (
            SELECT count(*)
            FROM public.lesson_students ls
                WHERE ls.lesson_id = l.id AND ls.visit = true
        ) as "visitsCount",
        (
            SELECT jsonb_agg(json_build_object('id', agg."id", 'name', agg."name", 'visit', agg."visit"))
            FROM (
                SELECT s.*, ls.visit
                FROM public.students s
                LEFT JOIN public.lesson_students ls ON ls.lesson_id = l.id
                    WHERE s.id = ls.student_id
            ) as "agg"
        ) as "students",
        (
            SELECT jsonb_agg(json_build_object('id', agg."id", 'name', agg."name"))
            FROM (
                SELECT te.*
                FROM public.teachers te
                LEFT JOIN public.lesson_teachers lt ON lt.lesson_id = l.id
                    WHERE te.id = lt.teacher_id
            ) as "agg"
        ) as "teachers"
        FROM public.lessons l
        LIMIT $1 OFFSET $2;
        `

        // Чет не нашёл в pg как по DI инжектить сюда DataSource, поэтому просто импортнул инстанс. typeORM мне в этом плане, конечно, больше нравится
        const lessonsData = await client.query<LessonsViewModel>(queryString, [lessonsPerPage, skipCount])

        const resultedArray: Array<LessonsViewModel> = []

        // Пытался фильтровать элементы в sql, но не вышло достать данные из подзапроса
        lessonsData.rows.forEach((lesson) => {
            const displayedLesson = new LessonsViewModel(lesson)

            if (!filterByStatus(+status, displayedLesson.status)) {
                return
            }

            // Фильтрую по параметрам studentsCount
            if (!filterByStudentsCount(preparedStudentCount, displayedLesson.students.length)) {
                return
            }

            resultedArray.push(new LessonsViewModel(lesson))
        }, [])

        return resultedArray
    }
}