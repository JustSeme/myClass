import { injectable } from "inversify"
import { client } from "../repositories/db"
import { GetLessonsQueryType } from "../request-types"
import { LessonsViewModel } from "../application/models/LessonsViewModel"
import { prepareParamWithCommaSeparator, prepareTeacherIds } from "../helpers"

@injectable()
export class LessonsQueryRepository {

    async findLessons(lessonsQueryParams: GetLessonsQueryType): Promise<LessonsViewModel[]> {
        let {
            date = null, status = -1, teacherIds = '', studentsCount = '', page = 1, lessonsPerPage = 5
        } = lessonsQueryParams

        const skipCount = (+page - 1) * +lessonsPerPage

        const preparedStudentCount = prepareParamWithCommaSeparator(studentsCount)
        const preparedTeacherIds = prepareTeacherIds(teacherIds)

        const parametersArray = [lessonsPerPage, skipCount]

        let studentsCountQueryString = ''
        if (preparedStudentCount.length) {
            parametersArray.push(preparedStudentCount[0])
            studentsCountQueryString = `HAVING count(s.id) = $${parametersArray.length}`

            if (preparedStudentCount[1]) {
                parametersArray.push(preparedStudentCount[1])
                studentsCountQueryString = `HAVING count(s.id) >= $3 AND count(s.id) <= $${parametersArray.length}`
            }
        }

        let teacherIdsQueryString = ''
        if (preparedTeacherIds.length) {
            teacherIdsQueryString = `WHERE te.id IN (${teacherIds})`
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
		GROUP BY l.id
        ${studentsCountQueryString}
        LIMIT $1 OFFSET $2;
        `

        // Чет не нашёл в pg как по DI инжектить сюда DataSource, поэтому просто импортнул инстанс. typeORM мне в этом плане, конечно, больше нравится
        const lessonsData = await client.query<LessonsViewModel>(queryString, parametersArray)

        return lessonsData.rows.map(lesson => new LessonsViewModel(lesson))
    }
}