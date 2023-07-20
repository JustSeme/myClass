import { injectable } from "inversify"
import { client } from "./db"
import { GetLessonsQueryType } from "../request-types"
import { LessonsViewModel } from "../application/models/LessonsViewModel"
import { prepareDate, prepareStudentsCount, prepareTeacherIds } from "../helpers"

@injectable()
export class LessonsQueryRepository {

    async findLessons(lessonsQueryParams: GetLessonsQueryType): Promise<LessonsViewModel[]> {
        let {
            date = '', status = -1, teacherIds = '', studentsCount = '', page = 1, lessonsPerPage = 5
        } = lessonsQueryParams

        const skipCount = (+page - 1) * +lessonsPerPage

        const preparedStudentCount = prepareStudentsCount(studentsCount)
        const preparedTeacherIds = prepareTeacherIds(teacherIds)
        const preparedDate = prepareDate(date)

        const parametersArray = [lessonsPerPage, skipCount]

        let studentsCountQueryString = ''
        if (preparedStudentCount.length) {
            parametersArray.push(preparedStudentCount[0])
            studentsCountQueryString = `HAVING count(s.id) = $${parametersArray.length}`

            if (preparedStudentCount[1]) {
                parametersArray.push(preparedStudentCount[1])
                studentsCountQueryString = `HAVING count(s.id) >= $${parametersArray.length - 1} AND count(s.id) <= $${parametersArray.length}`
            }
        }

        let teacherIdsQueryString = ''
        if (preparedTeacherIds?.length) {
            // Сделал конатенацию вместо использования параметров, сомневаюсь, что здесь возможен SQL-Injection
            teacherIdsQueryString = `WHERE te.id IN (${preparedTeacherIds})`
        }

        let statusQueryString = ''
        if (status !== -1) {
            parametersArray.push(status)
            statusQueryString = `WHERE l.status = $${parametersArray.length}`
        }

        let dateQueryString = ''
        if (preparedDate.length) {
            parametersArray.push(preparedDate[0])
            dateQueryString = `WHERE l.date = $${parametersArray.length}`
            if (preparedDate[1]) {
                parametersArray.push(preparedDate[1])
                dateQueryString = `WHERE l.date >= $${parametersArray.length - 1} AND l.date <= $${parametersArray.length}`
            }
        }

        const queryString = `
        SELECT l.*,
            (
                SELECT count(*)
                FROM public.lesson_students ls
                WHERE ls.lesson_id = l.id AND ls.visit = true
            ) as "visitsCount",
            (
                SELECT jsonb_agg(json_build_object('id', agg."id", 'name', agg."name", 'visit', agg."visit"))
                FROM(
                    SELECT s.*, ls.visit
                    FROM public.students s
                    LEFT JOIN public.lesson_students ls ON ls.lesson_id = l.id
                    WHERE s.id = ls.student_id) as "agg"
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
		LEFT JOIN public.lesson_teachers lt 
            ON lt.lesson_id = l.id
		LEFT JOIN public.teachers te
            ON te.id = lt.teacher_id
		LEFT JOIN public.lesson_students ls
            ON ls.lesson_id = l.id
		LEFT JOIN public.students s
            ON s.id = ls.student_id
        ${teacherIdsQueryString}
        ${statusQueryString}
        ${dateQueryString}
		GROUP BY l.id
        ${studentsCountQueryString}
        ORDER BY l.date ASC
        LIMIT $1 OFFSET $2;
        `

        // Чет не нашёл в pg как по DI инжектить сюда DataSource, поэтому просто импортнул инстанс. typeORM мне в этом плане, конечно, больше нравится
        const lessonsData = await client.query<LessonsViewModel>(queryString, parametersArray)

        return lessonsData.rows.map(lesson => new LessonsViewModel(lesson))
    }
}