import { injectable } from "inversify";
import { CreateLessonsInputModel } from "../api/models/CreateLessonsInputModel";
import { client } from "./db";
import { getInsertLessonTeachersValuesString, getInsertLessonsValuesString } from "../helpers";

@injectable()
export class LessonsRepository {

    // Тут надо бы делать транзакцию создания записи в lessons и lessons_teachers, но в pg нет транзакций,
    // так что буду считать, что это не предусмотрено условиями задачи
    async createLessons(lessonsInputModel: CreateLessonsInputModel): Promise<number[]> {
        const { teacherIds, title, days, firstDate, lessonsCount, lastDate } = lessonsInputModel;

        const insertLessonsQueryString = getInsertLessonsValuesString(lessonsCount, firstDate, lastDate, days, title)
        const insertLessonTeachersQueryString = getInsertLessonTeachersValuesString(teacherIds)
        const preparedTeacherIds = teacherIds.join(', ')

        const queryString = `
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
        ` // Предполагаю, что конкатенация возможна, поскольку данные высчитывались моим кодом и sql-injection невозможен

        const createdLessonsIds = await client.query(queryString)

        console.log(createdLessonsIds.rows);


        //const createdLessonIdsArray = createdLessonsIds.rows.map(objId => objId.id)

        //@ts-ignore
        return ''
    }
}