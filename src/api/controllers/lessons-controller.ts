import { injectable } from "inversify"
import { Response, Request } from "express"
import { HTTP_STATUSES } from "../../settings"
import { LessonsService } from "../../application/lessons-service"
import { LessonsQueryRepository } from "../../infractructure/lessons-query-repository"
import { GetLessonsQueryType, RequestWithQuery } from "../../request-types"
import { LessonsViewModel } from "../../application/models/LessonsViewModel"

@injectable()
export class LessonsController {
    constructor(
        private lessonsService: LessonsService,
        private lessonsQueryRepository: LessonsQueryRepository,
    ) { }


    async findLessons(req: RequestWithQuery<GetLessonsQueryType>, res: Response<LessonsViewModel[]>): Promise<void> {
        const findedLessons = await this.lessonsQueryRepository.findLessons(req.query)
        if (!findedLessons) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res
            .status(HTTP_STATUSES.OK_200)
            .send(findedLessons)

        return
    }

    async createLessons(req: Request, res: Response<{ lessonIds: number[] }>): Promise<void> {
        const lessonIds = await this.lessonsService.createLessons(req)

        if (!lessonIds.length) {
            res.sendStatus(HTTP_STATUSES.NOT_IMPLEMENTED_501)
            return
        }

        res.send({
            lessonIds: lessonIds
        })

        return
    }
}