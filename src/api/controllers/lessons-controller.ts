import { injectable } from "inversify"
import { Response, Request } from "express"
import { HTTP_STATUSES } from "../../settings"
import { LessonsService } from "../../application/lessons-service"
import { LessonsQueryRepository } from "../../infractructure/lessons-query-repository"
import { RequestWithBody, RequestWithQuery } from "../../request-types"
import { LessonsViewModel } from "../../application/models/LessonsViewModel"
import { GetLessonsQueryType } from "../models/GetLessonsQueryModel"
import { CreateLessonsInputModel } from "../models/CreateLessonsInputModel"

@injectable()
export class LessonsController {
    constructor(
        private lessonsService: LessonsService,
        private lessonsQueryRepository: LessonsQueryRepository,
    ) { }


    async findLessons(req: RequestWithQuery<GetLessonsQueryType>, res: Response<LessonsViewModel[]>): Promise<void> {
        try {
            const findedLessons = await this.lessonsQueryRepository.findLessons(req.query)
            if (!findedLessons.length) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            res
                .status(HTTP_STATUSES.OK_200)
                .send(findedLessons)

            return
        } catch (error) {
            res
                .status(HTTP_STATUSES.NOT_IMPLEMENTED_501)
                .send(error as any)
        }
    }

    async createLessons(req: RequestWithBody<CreateLessonsInputModel>, res: Response<{ lessonIds: number[] }>): Promise<void> {
        try {
            const lessonIds = await this.lessonsService.createLessons(req.body)

            if (!lessonIds.length) {
                res.sendStatus(HTTP_STATUSES.NOT_IMPLEMENTED_501)
                return
            }

            res.send({
                lessonIds: lessonIds
            })

            return
        } catch (error) {
            res
                .status(HTTP_STATUSES.NOT_IMPLEMENTED_501)
                .send(error as any)
            return
        }
    }
}