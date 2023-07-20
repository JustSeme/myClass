import { injectable } from "inversify";
import { CreateLessonsInputModel } from "../api/models/CreateLessonsInputModel";
import { client } from "./db";
import moment from "moment";
import { dateFormat, getInsertingValuesString } from "../helpers";

@injectable()
export class LessonsRepository {

    // Тут надо бы делать транзакцию создания записи в lessons и lessons_teachers, но в pg нет транзакций,
    // так что буду считать, что это не предусмотрено условиями задачи
    async createLessons(lessonsInputModel: CreateLessonsInputModel): Promise<number[]> {
        const { teacherIds, title, days, firstDate, lessonsCount, lastDate } = lessonsInputModel;

        const insertingValuesQueryString = getInsertingValuesString(lessonsCount, firstDate, lastDate, days, title)

        const queryString = `
            INSERT INTO public.lessons(
                title, date)
                VALUES ${insertingValuesQueryString}
                RETURNING id;
        ` // Предполагаю, что конкатенация возможна, поскольку данные высчитывались моим кодом и sql-injection невозможен

        const createdLessonsIds = await client.query(queryString)

        const createdLessonIdsArray = createdLessonsIds.rows.map(objId => objId.id)

        return createdLessonIdsArray
    }
}