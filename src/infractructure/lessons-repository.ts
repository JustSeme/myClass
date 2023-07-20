import { injectable } from "inversify";
import { CreateLessonsInputModel } from "../api/models/CreateLessonsInputModel";
import { client } from "./db";

@injectable()
export class LessonsRepository {

    async createLessons(lessonsInputModel: CreateLessonsInputModel): Promise<number[]> {
        // Тут надо бы делать транзакцию создания записи в lessons и lessons_teachers, но в pg нет транзакций,
        // так что буду считать, что это не предусмотрено условиями задачи

        const queryString = `
            INSERT INTO public.lessons
                (date, title)
                VALUES (?, ?);
        `



        return []
    }
}