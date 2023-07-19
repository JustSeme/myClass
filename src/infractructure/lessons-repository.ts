import { injectable } from "inversify";

@injectable()
export class LessonsRepository {

    async createLessons(lessonsInputModel: any): Promise<number[]> {
        return []
    }
}