import { injectable } from "inversify";
import { CreateLessonsInputModel } from "../api/models/CreateLessonsInputModel";
import { dbSettings } from "./db";
import { getInsertLessonsValuesString } from "../helpers";
import { Pool } from "pg";

@injectable()
export class LessonsRepository {

    async createLessons(lessonsInputModel: CreateLessonsInputModel): Promise<number[]> {
        const { teacherIds, title, days, firstDate, lessonsCount, lastDate } = lessonsInputModel;

        const pool = new Pool(dbSettings)

        let insertLessonsQueryString
        try {
            insertLessonsQueryString = getInsertLessonsValuesString(lessonsCount, firstDate, lastDate, days, title)
        } catch (err) {
            throw new Error(err as any)
        }

        const preparedTeacherIds = teacherIds.join(', ')

        // Сначала сделал так, но не мог достать lesson_ids, так что пришлось повторно пробежаться по массиву idшек
        /* const queryString = `
            WITH inserted_lessons as (
                INSERT INTO public.lessons(
                    title, date
                )
                VALUES ${insertLessonsQueryString}
                RETURNING id
            )
            INSERT INTO lesson_teachers (lesson_id, teacher_id)
            SELECT id, teacher_id 
                FROM inserted_lessons il, unnest(ARRAY[${preparedTeacherIds}]) as teacher_id
                RETURNING il.id;
        ` */

        const queryCreateLesson = `
            INSERT INTO public.lessons(
                title, date
            )
            VALUES ${insertLessonsQueryString}
            RETURNING id;
        `// Предполагаю, что конкатенация возможна, поскольку данные высчитывались моим кодом и sql-injection невозможен

        let createdLessonIdsArray: number[] = []
        let client: any
        try {
            client = await pool.connect()

            const createdLessonsIds = await client.query(queryCreateLesson)

            createdLessonIdsArray = createdLessonsIds.rows.map((objId: { id: number }) => objId.id)

            const lessonIdsAsValues = createdLessonIdsArray.join(', ')

            const queryCreateLessonTeacher = `
            INSERT INTO lesson_teachers (lesson_id, teacher_id)
            SELECT id, teacher_id 
                FROM unnest(ARRAY[${lessonIdsAsValues}]) as id, unnest(ARRAY[${preparedTeacherIds}]) as teacher_id;
            `

            await client.query(queryCreateLessonTeacher)

            return createdLessonIdsArray
        } catch (error) {
            console.error(error)
            throw new Error(error as any)
        } finally {
            await client.release()
        }
    }
}