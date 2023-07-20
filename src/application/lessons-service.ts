import { injectable } from "inversify";
import { LessonsRepository } from "../infractructure/lessons-repository";
import { CreateLessonsInputModel } from "../api/models/CreateLessonsInputModel";

@injectable()
export class LessonsService {
    constructor(
        private lessonsRepository: LessonsRepository
    ) { }

    async createLessons(lessonsInputModel: CreateLessonsInputModel): Promise<number[]> {
        return this.lessonsRepository.createLessons(lessonsInputModel)
    }
}