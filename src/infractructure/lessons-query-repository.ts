import { injectable } from "inversify"
import { client } from "./db"
import { LessonsViewModel } from "../application/models/LessonsViewModel"
import { prepareAllQueryParams } from "../helpers"
import { GetLessonsQueryType } from "../api/models/GetLessonsQueryModel"

@injectable()
export class LessonsQueryRepository {

    async findLessons(lessonsQueryParams: GetLessonsQueryType): Promise<LessonsViewModel[]> {
        const {
            teacherIdsQueryString,
            statusQueryString,
            dateQueryString,
            studentsCountQueryString,
            parametersArray
        } = prepareAllQueryParams(lessonsQueryParams)

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

    async isTeacherExists(teacherId: number): Promise<boolean> {
        try {
            const queryString = `
                SELECT t.id
                    FROM public.teachers t
                    WHERE t.id = $1
            `

            const teacherById = await client.query(queryString, [teacherId])

            return teacherById.rows.length ? true : false
        } catch (err) {
            console.error(err)
            return false
        }
    }
}