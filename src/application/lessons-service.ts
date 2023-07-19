import { injectable } from "inversify";
import { LessonsRepository } from "../infractructure/lessons-repository";

@injectable()
export class LessonsService {
    constructor(
        private lessonsRepository: LessonsRepository
    ) { }

    async createLessons(lessonsInputModel: any): Promise<number[]> {
        return this.lessonsRepository.createLessons(lessonsInputModel)
    }
}