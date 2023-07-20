import { injectable } from "inversify";
import { CreateLessonsInputModel } from "../api/models/CreateLessonsInputModel";

@injectable()
export class LessonsRepository {

    async createLessons(lessonsInputModel: CreateLessonsInputModel): Promise<number[]> {
        return []
    }
}